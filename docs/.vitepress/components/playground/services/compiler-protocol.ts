import type { CompilationResult } from "../types";

/** Plain structured-clone messages; Java/Wasm objects never cross the worker boundary. */
export type CompilerRequest =
  | { id: number; type: "initialize"; baseUrl: string }
  | { id: number; type: "compile"; source: string };

export interface KernelResult extends CompilationResult {
  kernelUsable: boolean;
  timings: {
    preparationNanos: number;
    compilationNanos: number;
    restorationNanos: number;
    totalNanos: number;
  };
}

export type CompilerEvent =
  | { type: "progress"; message: string }
  | { type: "ready" }
  | { type: "result"; result: KernelResult }
  | { type: "error"; message: string };
export type CompilerResponse = CompilerEvent & { id: number };
