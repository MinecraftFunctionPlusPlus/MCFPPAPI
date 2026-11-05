import type {
  PlaygroundDiagnostic,
  PlaygroundSessionController,
} from "@datapack-sandbox/vitepress-playground";
import type { GeneratedFile, RunOutput, RunResult } from "../types";
import workerUrl from "@mcfpp/dsb-worker?worker&url";

interface FunctionTag {
  values: Array<string | { id: string; required?: boolean }>;
}

/** DSB 0.2.2 不接受 function #tag，因此按数据包顺序展开 load 标签。 */
function loadFunctions(files: GeneratedFile[]): string[] {
  const byPath = new Map(files.map((file) => [file.path, file.content]));

  function expand(
    tag: string,
    visiting = new Set<string>(),
    required = true,
  ): string[] {
    const id = tag.includes(":") ? tag : `minecraft:${tag}`;
    if (visiting.has(id)) throw new Error(`load 标签循环引用：${id}`);
    const [namespace, path] = id.split(":");
    const source = byPath.get(`data/${namespace}/tags/function/${path}.json`);
    if (source === undefined) {
      if (required) throw new Error(`缺少函数标签：${id}`);
      return [];
    }

    const next = new Set(visiting).add(id);
    const parsed: FunctionTag = JSON.parse(source);
    return parsed.values.flatMap((entry) => {
      const value = typeof entry === "string" ? entry : entry.id;
      const needed = typeof entry === "string" || entry.required !== false;
      if (value.startsWith("#")) return expand(value.slice(1), next, needed);
      const functionId = value.includes(":") ? value : `minecraft:${value}`;
      const [space, name] = functionId.split(":");
      return needed || byPath.has(`data/${space}/function/${name}.mcfunction`)
        ? [functionId]
        : [];
    });
  }

  return expand("minecraft:load", new Set(), false);
}

export class DatapackRunner {
  private session?: PlaygroundSessionController;
  stopped = false;

  stop(): void {
    this.stopped = true;
    this.session?.dispose();
  }

  async run(files: GeneratedFile[], entry: string): Promise<RunResult> {
    this.stopped = false;
    const { PlaygroundSessionController } = await import("./sandbox-runtime");
    if (this.stopped) throw new Error("已停止运行。");

    // 每次创建新 Worker/世界，防止函数、计分板和 storage 跨次运行残留。
    const session = new PlaygroundSessionController({
      workerUrl,
      notebook: { version: "1.21.8", cells: [] },
      render: { auto: false },
    });
    this.session = session;
    const outputs: RunOutput[] = [];
    const diagnostics: PlaygroundDiagnostic[] = [];
    let commands = 0;

    session.onEvent((event) => {
      if (event.type === "diagnostic")
        diagnostics.push(...(event.diagnostics ?? []));
      if (event.type === "cell.output" && event.kind === "execution") {
        commands += Number(event.result?.commands ?? 0);
        // SDK 将执行结果声明为 Record<string, unknown>；在这个边界收窄类型。
        const resultOutputs = event.result?.outputs;
        if (Array.isArray(resultOutputs))
          outputs.push(...(resultOutputs as RunOutput[]));
      }
    });

    try {
      await session.connect();
      const encoder = new TextEncoder();
      await session.client.importEntries(
        "datapack",
        files.map((file) => ({
          path: file.path,
          bytes: encoder.encode(file.content).buffer,
        })),
        true,
      );

      // deferLoad=true 后显式执行一次初始化，才能同时收集 load 的输出和诊断。
      const functions = [...loadFunctions(files), entry];
      await session.execute(
        "main",
        functions.map((id) => `function ${id}`).join("\n"),
        { auto: false },
      );
      if (diagnostics.some((diagnostic) => diagnostic.severity === "error")) {
        throw new Error(
          diagnostics.map((diagnostic) => diagnostic.message).join("\n"),
        );
      }
      return { outputs, commands };
    } catch (error) {
      const detail = diagnostics
        .map(({ command, message }) =>
          command ? `${command}\n${message}` : message,
        )
        .join("\n");
      const failure = error as { code?: string; message?: string };
      const fallback = `${failure.code ? `${failure.code}: ` : ""}${failure.message ?? "未知运行错误"}`;
      throw new Error(this.stopped ? "已停止运行。" : detail || fallback, {
        cause: error,
      });
    } finally {
      session.dispose();
      if (this.session === session) this.session = undefined;
    }
  }
}
