import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch,
} from "vue";
import { withBase } from "vitepress";
import {
  CompilerTimeoutError,
  compilerErrorText,
  initializeCompiler,
  type BrowserCompiler,
} from "./services/compiler";
import { DatapackRunner } from "./services/sandbox";
import type { CompilerDiagnostic, GeneratedFile, RunOutput } from "./types";

const DEFAULT_SOURCE = `func greet() {
    print("Hello, MCFPP!")
}

func main() {
    greet()
    var values: list<int> = [10, 20]
    values.add(30)
    print(values.size())
}
`;

const RUN_HINT = "Powered by DSB";
const DRAFT_KEY = "mcfpp.playground.source";

function readDraft(): string {
  try {
    return localStorage.getItem(DRAFT_KEY) ?? DEFAULT_SOURCE;
  } catch {
    return DEFAULT_SOURCE;
  }
}
const seconds = (started: number): string =>
  `${((performance.now() - started) / 1000).toFixed(2)} s`;
type CompilerState = "loading" | "ready" | "compiling" | "success" | "error";
type RunState = "idle" | "running" | "success" | "error";

/** 管理页面状态；组件负责展示，服务负责编译和 DSB Worker 的生命周期。 */
export function usePlayground() {
  // Worker 和编译内核由服务持有，组件只保存可展示的数据。
  let compiler: BrowserCompiler | undefined;
  const compiledSource = ref<string | null>(null);
  let sourceRevision = 0;
  let disposed = false;
  const runner = new DatapackRunner();
  const source = ref(readDraft());
  const files = shallowRef<GeneratedFile[]>([]);
  const diagnostics = shallowRef<CompilerDiagnostic[]>([]);
  const ready = ref(false);
  const compiling = ref(false);
  const running = ref(false);
  const entry = ref("");
  const showFeedback = ref(false);
  const runOutputs = shallowRef<RunOutput[]>([]);

  const compilation = reactive({
    state: "loading" as CompilerState,
    status: "正在初始化",
    message: "首次使用需要加载 TeaVM WasmGC 编译器及内置标准库。",
    elapsed: "",
    initializationTime: "",
    needsReload: false,
  });
  const execution = reactive({
    state: "idle" as RunState,
    status: "等待编译",
    placeholder: "编译成功后会在 DSB 中运行 main。",
    message: RUN_HINT,
  });

  const busy = computed(() => compiling.value || running.value);
  const canCompile = computed(() => ready.value && !busy.value);
  const canRun = computed(
    () => !busy.value && compiledSource.value === source.value && !!entry.value,
  );
  const entries = computed(() =>
    files.value.flatMap((file) => {
      const match = /^data\/playground\/function\/(.+)\.mcfunction$/.exec(
        file.path,
      );
      return match ? [`playground:${match[1]}`] : [];
    }),
  );
  const runOutput = computed(() => {
    if (execution.state !== "success") return execution.placeholder;
    const displayed = showFeedback.value
      ? runOutputs.value
      : runOutputs.value.filter((output) =>
          ["chat", "title"].includes(output.channel),
        );
    return (
      displayed
        .map((output) => {
          const prefix = showFeedback.value ? `[${output.command}] ` : "";
          return prefix + (output.text || output.rawText || "");
        })
        .join("\n") ||
      "运行完成，没有聊天或标题输出。可启用“命令反馈”查看全部结果。"
    );
  });

  function clearResults(): void {
    compiledSource.value = null;
    files.value = [];
    diagnostics.value = [];
    entry.value = "";
    runOutputs.value = [];
    compilation.elapsed = "";
    Object.assign(execution, {
      state: "idle",
      status: "等待编译",
      placeholder: "编译成功后会在 DSB 中运行 main。",
      message: RUN_HINT,
    });
  }

  async function runGenerated(): Promise<void> {
    const snapshot = compiledSource.value;
    if (
      running.value ||
      snapshot === null ||
      snapshot !== source.value ||
      !entry.value
    )
      return;
    const revision = sourceRevision;
    const selectedEntry = entry.value;
    const current = () => !disposed && revision === sourceRevision;
    running.value = true;
    runOutputs.value = [];
    Object.assign(execution, {
      state: "running",
      status: "DSB 运行中",
      placeholder: "",
      message: `正在运行 ${selectedEntry}…`,
    });
    const started = performance.now();

    try {
      const result = await runner.run(files.value, selectedEntry);
      if (!current()) return;
      runOutputs.value = result.outputs;
      execution.state = "success";
      execution.status = "运行成功";
      execution.message = `DSB · ${selectedEntry} · ${result.commands} 条命令 · ${result.outputs.length} 条输出 · ${seconds(started)}`;
    } catch (error) {
      if (!current()) return;
      execution.state = "error";
      execution.status = runner.stopped ? "已停止" : "运行失败";
      execution.placeholder =
        error instanceof Error ? error.message : "未知运行错误";
      execution.message = "可修改源码重新编译，或选择入口再次运行。";
    } finally {
      running.value = false;
    }
  }

  async function compile(): Promise<void> {
    if (!canCompile.value || !compiler) return;
    const snapshot = source.value;
    const revision = sourceRevision;
    const current = () => !disposed && revision === sourceRevision;
    compiling.value = true;
    clearResults();
    compilation.state = "compiling";
    compilation.status = "正在编译";
    compilation.message = "正在浏览器中编译并读取生成文件。";
    const started = performance.now();
    const timer = setInterval(() => {
      if (current()) compilation.elapsed = seconds(started);
    }, 1000);

    try {
      const result = await compiler.compile(snapshot, (message) => {
        if (current()) compilation.message = message;
      });
      // 即使用户改动后又改回原文，也不展示已经失效的异步结果。
      if (!current()) return;
      diagnostics.value = result.diagnostics;
      if (!result.success) {
        const runtimeFailure = result.diagnostics.some(
          (item) => item.code === "MCFPP_COMPILATION_FAILED",
        );
        compilation.state = "error";
        compilation.status = runtimeFailure ? "运行时编译失败" : "编译失败";
        compilation.needsReload = runtimeFailure;
        compilation.message = runtimeFailure
          ? "编译器发生运行异常，可以重新加载运行时后重试。"
          : "修正源码后可以重新编译。";
        return;
      }

      compiledSource.value = snapshot;
      files.value = result.files;
      compilation.state = "success";
      compilation.status = "编译成功";
      compilation.needsReload = false;
      compilation.message = `已加载 ${result.loadedLibraries} 个库，生成 ${result.files.length} 个文件。`;
      entry.value = entries.value.includes("playground:main")
        ? "playground:main"
        : (entries.value.find(
            (id) => !/^playground:(init|load|tick)$/.test(id),
          ) ?? "");
      // 编译计时与 DSB 执行分开；运行面板自身处理错误和停止操作。
      if (entry.value) void runGenerated();
      else {
        execution.status = "请选择入口";
        execution.placeholder = "没有 main 函数，可选择其他入口运行。";
      }
    } catch (error) {
      // 错误到达时再次确认源码版本，避免覆盖用户的新输入。
      const message = await compilerErrorText(error);
      if (!current()) return;
      diagnostics.value = [
        { code: "RUNTIME_ERROR", severity: "error", message },
      ];
      const timedOut = error instanceof CompilerTimeoutError;
      compilation.state = "error";
      compilation.status = timedOut ? "编译超时" : "编译失败";
      compilation.message = timedOut
        ? "编译等待超时，请重新加载运行时后重试。"
        : "编译运行失败；可修正源码重试，或重新加载运行时。";
      compilation.needsReload = true;
      if (timedOut) ready.value = false;
    } finally {
      clearInterval(timer);
      if (current()) compilation.elapsed = seconds(started);
      compiling.value = false;
    }
  }

  watch(
    source,
    () => {
      sourceRevision++;
      // 重载是运行时故障后的恢复入口，保留草稿以免恢复时丢失用户代码。
      try {
        localStorage.setItem(DRAFT_KEY, source.value);
      } catch {
        // 浏览器禁止持久存储时，仍允许正常编辑和编译。
      }
      if (running.value) runner.stop();
      clearResults();
      if (ready.value) {
        compilation.state = "ready";
        compilation.status = compiling.value ? "源码已修改" : "待编译";
        compilation.message = compiling.value
          ? "编译期间源码已修改，请等待完成后再次编译。"
          : "点击“编译并运行”查看新结果。";
      }
    },
    { flush: "sync" },
  );

  onMounted(async () => {
    const started = performance.now();
    const timer = setInterval(() => {
      if (!disposed) compilation.initializationTime = `初始化 ${seconds(started)}`;
    }, 1000);
    try {
      // 中英文文档页面共用 public 下的编译器资源，并支持站点 base 前缀。
      compiler = await initializeCompiler(
        new URL(withBase("/playground/"), location.origin),
        (message) => {
          if (!disposed) compilation.message = message;
        },
      );
      if (disposed) return;
      ready.value = true;
      compilation.state = "ready";
      compilation.status = "编译器就绪";
      compilation.message =
        "编译器已就绪。点击“编译并运行”查看生成的函数与诊断。";
    } catch (error) {
      if (disposed) return;
      compilation.state = "error";
      compilation.status =
        error instanceof CompilerTimeoutError ? "初始化超时" : "初始化失败";
      compilation.message = "编译器初始化失败。";
      compilation.needsReload = true;
      diagnostics.value = [
        {
          code: "INITIALIZATION_FAILED",
          severity: "error",
          message: await compilerErrorText(error),
        },
      ];
    } finally {
      clearInterval(timer);
      if (!disposed)
        compilation.initializationTime = `初始化 ${seconds(started)}`;
    }
  });

  onBeforeUnmount(() => {
    disposed = true;
    runner.stop();
  });

  return {
    source,
    files,
    diagnostics,
    compilation,
    execution,
    entry,
    entries,
    showFeedback,
    busy,
    running,
    canCompile,
    canRun,
    runOutput,
    compile,
    runGenerated,
    stop: () => runner.stop(),
    reload: () => location.reload(),
  };
}
