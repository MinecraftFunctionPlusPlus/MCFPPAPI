/**
 * 只声明本页面实际使用的 LiveConnect 接口。
 * Java 构造器、方法和类查找都会返回 Promise，不能当作同步 JS 对象使用。
 */
export interface JavaObject {
  toString(): Promise<string>;
}

export type JavaText = string | JavaObject | null;

interface JavaFile {
  toPath(): Promise<JavaObject>;
}

/** A persistent compiler host. Its mutable request state is reset inside Java after each call. */
export interface CompilerKernel {
  close(): Promise<void>;
}

export interface CheerpJLibrary {
  java: {
    io: {
      File: Promise<new (path: string) => Promise<JavaFile>>;
    };
  };
  com: {
    alibaba: {
      fastjson2: {
        JSON: Promise<{
          toJSONString(value: JavaObject): Promise<string>;
        }>;
      };
    };
  };
  top: {
    mcfpp: {
      api: {
        library: {
          PlaygroundCompilerApi: Promise<{
            openKernel(directory: JavaObject, minecraftVersion: string, namespace: string): Promise<CompilerKernel>;
            compile(kernel: CompilerKernel, source: string): Promise<JavaObject>;
          }>;
        };
      };
    };
  };
}

declare global {
  function cheerpjInit(options: {
    version: 25;
    status: "none";
    preloadResources: Record<string, number[]>;
    preloadProgress: (done: number, total: number) => void;
  }): Promise<void>;
  function cheerpjRunLibrary(classpath: string): Promise<CheerpJLibrary>;
}

export async function javaText(value: JavaText): Promise<string> {
  // String(proxy) 会隐式调用异步 toString，留下未等待的 Java 调用并破坏后续会话。
  return value === null
    ? ""
    : typeof value === "string"
      ? value
      : await value.toString();
}

export async function compilerErrorText(error: unknown): Promise<string> {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "toString" in error) {
    return await javaText(error as JavaObject);
  }
  return "未知运行时异常";
}
