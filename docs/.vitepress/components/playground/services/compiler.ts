import type { CompilationResult, GeneratedFile } from "../types";
import type { CompilerRequest, CompilerResponse, KernelResult } from "./compiler-protocol";

type ReportProgress = (message: string) => void;
export class CompilerTimeoutError extends Error {}

export async function compilerErrorText(error: unknown): Promise<string> {
  return error instanceof Error ? error.message : String(error);
}

interface PendingRequest {
  resolve(result?: KernelResult): void;
  reject(error: Error): void;
  progress: ReportProgress;
  timer: ReturnType<typeof setTimeout>;
}

function fileRank(file: GeneratedFile): number {
  if (file.path.startsWith("data/playground/function/")) return 0;
  return file.path.endsWith(".mcfunction") ? 1 : 2;
}

/** One worker owns one Wasm instance and one reusable library baseline. */
export class BrowserCompiler {
  private readonly worker = new Worker(new URL("./compiler.worker.ts", import.meta.url), { type: "module" });
  private readonly pending = new Map<number, PendingRequest>();
  private nextRequest = 0;
  private queue: Promise<void> = Promise.resolve();
  private unavailable: Error | undefined;
  /** Detached timing values for profiling; first compilation includes all library preparation. */
  lastTimings: KernelResult["timings"] | undefined;

  private constructor() {
    this.worker.onmessage = ({ data }: MessageEvent<CompilerResponse>) => {
      const request = this.pending.get(data.id);
      if (!request) return;
      if (data.type === "progress") { request.progress(data.message); return; }
      this.pending.delete(data.id);
      clearTimeout(request.timer);
      if (data.type === "error") request.reject(new Error(data.message));
      else request.resolve(data.type === "result" ? data.result : undefined);
    };
    this.worker.onerror = (event) => this.stop(new Error(event.message || "TeaVM 编译 Worker 加载失败。"));
    this.worker.onmessageerror = () => this.stop(new Error("无法读取编译 Worker 返回的数据。"));
  }

  static async create(baseUrl: URL, progress: ReportProgress): Promise<BrowserCompiler> {
    const compiler = new BrowserCompiler();
    try {
      await compiler.request({ id: ++compiler.nextRequest, type: "initialize", baseUrl: baseUrl.href }, progress, 120_000);
      return compiler;
    } catch (error) {
      compiler.stop(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  private stop(error: Error): void {
    this.unavailable = error;
    this.worker.terminate();
    for (const request of this.pending.values()) {
      clearTimeout(request.timer); request.reject(error);
    }
    this.pending.clear();
  }

  private request(message: CompilerRequest, progress: ReportProgress, timeout: number): Promise<KernelResult | undefined> {
    if (this.unavailable) return Promise.reject(this.unavailable);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        // Unlike the JVM bridge, a stuck Wasm compilation can be cancelled with its worker.
        this.stop(new CompilerTimeoutError(`${message.type === "initialize" ? "初始化" : "编译"}耗时超过 ${timeout / 1000} 秒，请重新加载运行时。`));
      }, timeout);
      this.pending.set(message.id, { resolve, reject, progress, timer });
      this.worker.postMessage(message);
    });
  }

  async compile(source: string, progress: ReportProgress): Promise<CompilationResult> {
    const task = this.queue.then(async () => {
      progress("正在浏览器中编译，首次编译包含标准库准备。");
      const result = await this.request({ id: ++this.nextRequest, type: "compile", source }, progress, 60_000);
      if (!result) throw new Error("编译 Worker 未返回结果。");
      this.lastTimings = result.timings;
      if (!result.kernelUsable) this.stop(new Error("编译内核无法恢复，请重新加载运行时。"));
      const files = result.success ? result.files : [];
      files.sort((a, b) => fileRank(a) - fileRank(b) || a.path.localeCompare(b.path));
      return {
        success: result.success, files, loadedLibraries: result.loadedLibraries,
        diagnostics: result.diagnostics.map((entry) => ({
          ...entry,
          message: entry.message.replace(/\/playground\//g, "").replace(/request-\d+\/src\/main\/mcfpp\//g, ""),
        })),
      };
    });
    this.queue = task.then(() => undefined, () => undefined);
    return task;
  }
}

interface CompilerRuntime {
  engine: "teavm";
  compiler?: Promise<BrowserCompiler>;
  message: string;
  listeners: Set<ReportProgress>;
}

declare global {
  interface Window { __mcfppCompilerRuntime?: CompilerRuntime; }
}

/** Keep the worker across route changes and HMR without putting it into Vue's reactive graph. */
export async function initializeCompiler(baseUrl: URL, progress: ReportProgress): Promise<BrowserCompiler> {
  if (window.__mcfppCompilerRuntime?.engine !== "teavm") window.__mcfppCompilerRuntime = undefined;
  const runtime = (window.__mcfppCompilerRuntime ??= {
    engine: "teavm", message: "正在初始化 TeaVM 编译器。", listeners: new Set(),
  });
  runtime.listeners.add(progress);
  progress(runtime.message);
  try {
    runtime.compiler ??= BrowserCompiler.create(baseUrl, (message) => {
      runtime.message = message;
      runtime.listeners.forEach((listener) => listener(message));
    });
    return await runtime.compiler;
  } finally { runtime.listeners.delete(progress); }
}
