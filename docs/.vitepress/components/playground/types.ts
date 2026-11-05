/** 编译器、文件查看器与 DSB 共同使用的纯文本产物。 */
export interface GeneratedFile {
  path: string;
  content: string;
}

export interface CompilerDiagnostic {
  code: string;
  severity: string;
  message: string;
}

export interface CompilationResult {
  success: boolean;
  files: GeneratedFile[];
  diagnostics: CompilerDiagnostic[];
  loadedLibraries: number;
}

// DSB 0.2.2 未从包入口导出输出类型。直接取事件字段的类型，避免复制 SDK 定义。
export type RunOutput = NonNullable<
  import("@datapack-sandbox/vitepress-playground").PlaygroundEvent["output"]
>;

export interface RunResult {
  outputs: RunOutput[];
  commands: number;
}
