import type {
  CompilationResult,
  CompilerDiagnostic,
  GeneratedFile,
} from "../types";
import type { CheerpJLibrary, CompilerKernel } from "./cheerpj";
import { compilerErrorText } from "./cheerpj";
import { runtimeResources } from "./runtime-resources";
import { fixFilesystemReferenceCounting } from "./filesystem-compatibility";

type ReportProgress = (message: string) => void;

export class CompilerTimeoutError extends Error {}

/** 超时只结束页面的等待；Java 调用无法取消，因此随后必须重载 JVM。 */
async function withDeadline<T>(
  operation: Promise<T>,
  milliseconds: number,
  message: () => string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new CompilerTimeoutError(message())),
          milliseconds,
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

interface KernelResult {
  success: boolean;
  kernelUsable: boolean;
  files: GeneratedFile[];
  diagnostics: CompilerDiagnostic[];
  loadedLibraries: number;
}

interface CompilerMetadata {
  version: string;
  java: number;
  jar: string;
  compatibility?: { jar: string; fix: string };
  kernelApi?: number;
}

function fileRank(file: GeneratedFile): number {
  if (file.path.startsWith("data/playground/function/")) return 0;
  return file.path.endsWith(".mcfunction") ? 1 : 2;
}

/** 单个浏览器 JVM 的编译入口；调用方负责串行编译。 */
export class BrowserCompiler {
  private compilationQueue: Promise<void> = Promise.resolve();
  private unavailable: Error | undefined;

  private constructor(
    private readonly JSON: Awaited<
      CheerpJLibrary["com"]["alibaba"]["fastjson2"]["JSON"]
    >,
    private readonly API: Awaited<
      CheerpJLibrary["top"]["mcfpp"]["api"]["library"]["PlaygroundCompilerApi"]
    >,
    private readonly kernel: CompilerKernel,
    private readonly rootPath: string,
  ) {}

  static async create(library: CheerpJLibrary): Promise<BrowserCompiler> {
    // 保持 Java 桥调用顺序明确，避免同一 Library Mode 线程上交错访问。
    const File = await library.java.io.File;
    const JSON = await library.com.alibaba.fastjson2.JSON;
    const API = await library.top.mcfpp.api.library.PlaygroundCompilerApi;
    const rootPath = `/files/mcfpp-playground/${crypto.randomUUID()}`;
    const directory = await new File(rootPath);
    // Opening only reserves the host. First-compile timing includes library preparation.
    const kernel = await API.openKernel(await directory.toPath(), "1.21.8", "playground");
    return new BrowserCompiler(JSON, API, kernel, rootPath);
  }

  async compile(
    source: string,
    reportProgress: ReportProgress,
  ): Promise<CompilationResult> {
    if (this.unavailable) throw this.unavailable;
    let active = true;
    let phase = "等待上一次编译完成。";
    const progress: ReportProgress = (message) => {
      phase = message;
      if (active) reportProgress(message);
    };
    progress(phase);
    // 离开页面时正在进行的 JVM 调用仍需完成清理；再次进入页面后的编译排队执行。
    const task = this.compilationQueue.then(async () => {
      if (this.unavailable) throw this.unavailable;
      try {
        return await this.compileProject(source, progress);
      } catch (error) {
        // 在释放队列前完成 Java 异常的异步转换，避免与下一次编译交错使用桥接线程。
        throw new Error(await compilerErrorText(error), { cause: error });
      }
    });
    this.compilationQueue = task.then(
      () => undefined,
      () => undefined,
    );
    try {
      return await withDeadline(
        task,
        180_000,
        () => `编译耗时超过 180 秒。最后阶段：${phase}\n请重新加载运行时后重试。`,
      );
    } catch (error) {
      // 不在尚未返回的 Java 调用后继续排队，避免整个页面永远处于编译中。
      if (error instanceof CompilerTimeoutError) this.unavailable = error;
      throw error;
    } finally {
      active = false;
    }
  }

  private async compileProject(
    source: string,
    reportProgress: ReportProgress,
  ): Promise<CompilationResult> {
    reportProgress("正在编译，首次编译需要准备标准库。");
    // Java owns unique request paths, reads detached outputs, and restores the library baseline
    // before returning. One JSON bridge transfer avoids per-file and per-diagnostic round trips.
    const output = await this.API.compile(this.kernel, source);
    const result: KernelResult = JSON.parse(await this.JSON.toJSONString(output));
    if (!result.kernelUsable)
      this.unavailable = new Error("编译内核无法恢复，请重新加载运行时。");
    const files = result.success ? result.files : [];
    files.sort((a, b) => fileRank(a) - fileRank(b) || a.path.localeCompare(b.path));
    return {
      success: result.success,
      files,
      diagnostics: result.diagnostics.map((entry) => ({
        ...entry,
        message: entry.message
          .replaceAll(`${this.rootPath}/`, "")
          .replace(/request-\d+\/src\/main\/mcfpp\//g, ""),
      })),
      loadedLibraries: result.loadedLibraries,
    };
  }
}

function loadRuntime(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cjrtnc.leaningtech.com/5.0/loader.js";
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("无法加载 CheerpJ 运行时，请检查网络连接后重新加载。"));
    document.head.append(script);
  });
}

async function createCompiler(
  baseUrl: URL,
  reportProgress: ReportProgress,
): Promise<BrowserCompiler> {
  const response = await fetch(new URL("compiler.json", baseUrl), {
    cache: "no-cache",
  });
  if (!response.ok)
    throw new Error("编译器资源尚未准备。请先运行 pnpm playground:prepare。");
  const metadata: CompilerMetadata = await response.json();
  if (metadata.version !== "0.1.0" || metadata.java !== 25) {
    throw new Error("需要 MCFPP 0.1.0 / Java 25 发布包。");
  }
  if (metadata.kernelApi !== 1)
    throw new Error("需要支持可复用编译内核的 JAR，请重新运行 pnpm playground:prepare。");
  if (metadata.compatibility?.fix !== "reflective-nbt-dictionary-allocation") {
    throw new Error(
      "缺少 CheerpJ NBT 兼容补丁，请重新运行 pnpm playground:prepare。",
    );
  }

  reportProgress(
    "正在加载 CheerpJ 和 Java 25 运行时，首次加载可能需要一些时间。",
  );
  await loadRuntime();
  let lastPercentage = -1;
  await cheerpjInit({
    version: 25,
    status: "none",
    preloadResources: runtimeResources,
    preloadProgress: (done, total) => {
      if (total <= 0) return;
      const percentage = Math.floor((done / total) * 100);
      if (percentage === lastPercentage) return;
      lastPercentage = percentage;
      reportProgress(`正在预加载 Java 25 运行时（${percentage}%）。`);
    },
  });
  // 在应用开始读写文件前修正已确认的 5.0 引用计数问题。
  fixFilesystemReferenceCounting();
  reportProgress("正在加载 MCFPP 编译器及完整内置标准库。");

  // 覆盖 JAR 仅修复 NBT 构造器调用；原始发布 JAR 和公开编译 API 保持原样。
  const jarPath = new URL(metadata.jar, baseUrl).pathname;
  const compatibilityPath = new URL(metadata.compatibility.jar, baseUrl)
    .pathname;
  const library = await cheerpjRunLibrary(
    `/app${compatibilityPath}:/app${jarPath}`,
  );
  return BrowserCompiler.create(library);
}

interface CompilerRuntime {
  compiler?: Promise<BrowserCompiler>;
  message: string;
  listeners: Set<(message: string) => void>;
}

declare global {
  interface Window {
    __mcfppCompilerRuntime?: CompilerRuntime;
  }
}

/**
 * 浏览器文档只允许启动一次 CheerpJ Library Mode。
 * 状态放在 window 上，使站内切换、组件重挂载和 Vite 热更新都复用同一个 JVM。
 * Java 代理只由服务持有，不进入 Vue 响应式系统。
 */
export async function initializeCompiler(
  baseUrl: URL,
  reportProgress: ReportProgress,
): Promise<BrowserCompiler> {
  const runtime = (window.__mcfppCompilerRuntime ??= {
    message: "正在初始化编译器。",
    listeners: new Set(),
  });
  runtime.listeners.add(reportProgress);
  reportProgress(runtime.message);
  try {
    runtime.compiler ??= withDeadline(
      createCompiler(baseUrl, (message) => {
        runtime.message = message;
        runtime.listeners.forEach((listener) => listener(message));
      }),
      120_000,
      () => `初始化耗时超过 120 秒。最后阶段：${runtime.message}\n请检查网络连接后重新加载。`,
    );
    return await runtime.compiler;
  } finally {
    runtime.listeners.delete(reportProgress);
  }
}
