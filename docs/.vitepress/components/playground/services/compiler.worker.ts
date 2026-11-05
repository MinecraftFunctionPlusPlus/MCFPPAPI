import type {
  CompilerRequest,
  CompilerEvent,
  CompilerResponse,
  KernelResult,
} from "./compiler-protocol";

interface CompilerExports {
  main(args: string[]): void;
  compile(source: string): string;
}

// A local shape keeps the worker independent of the page's DOM declarations.
const worker = self as unknown as {
  onmessage: ((event: MessageEvent<CompilerRequest>) => void) | null;
  postMessage(message: CompilerResponse): void;
};
let compiler: CompilerExports | undefined;

/** The Wasm instance and its mutable compiler state belong exclusively to this worker. */
worker.onmessage = async ({ data: request }) => {
  const send = (message: CompilerEvent) =>
    worker.postMessage({ ...message, id: request.id });
  try {
    if (request.type === "initialize") {
      const base = new URL(request.baseUrl);
      const response = await fetch(new URL("teavm.json", base), { cache: "no-cache" });
      if (!response.ok) throw new Error("缺少 TeaVM 编译器资源，请运行 pnpm playground:prepare。");
      const metadata = await response.json();
      if (metadata.engine !== "teavm-wasm-gc" || metadata.kernelApi !== 1 || metadata.minecraft !== "1.21.8")
        throw new Error("TeaVM 编译器资源版本不匹配，请重新准备资源。");
      send({ type: "progress", message: "正在加载 TeaVM WasmGC 编译器及内置标准库。" });
      const runtimeUrl = new URL(metadata.runtime, base).href;
      const runtime = await import(/* @vite-ignore */ runtimeUrl);
      const loaded = await runtime.load(new URL(metadata.module, base).href);
      compiler = loaded.exports as CompilerExports;
      compiler.main([]);
      send({ type: "ready" });
    } else {
      if (!compiler) throw new Error("编译器尚未初始化。");
      send({ type: "progress", message: "正在编译，首次编译需要准备标准库。" });
      const result: KernelResult = JSON.parse(compiler.compile(request.source));
      send({ type: "result", result });
    }
  } catch (failure) {
    const message = failure instanceof Error ? failure.message : String(failure);
    send({ type: "error", message });
  }
};
