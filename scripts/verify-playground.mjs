import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";

const resources = new URL("../docs/public/playground/", import.meta.url);

/** Verify the exact Wasm/loader pair before building or starting the documentation site. */
async function verifyPlayground() {
  const metadata = JSON.parse(await readFile(new URL("teavm.json", resources), "utf8"));
  if (metadata.engine !== "teavm-wasm-gc" || metadata.teavm !== "0.16.0" || metadata.kernelApi !== 1
      || metadata.minecraft !== "1.21.8" || metadata.version !== "0.1.0"
      || metadata.module !== "teavm/mcfpp.wasm" || metadata.runtime !== "teavm/mcfpp.wasm-runtime.js") {
    throw new Error("需要 MCFPP 0.1.0 / TeaVM 0.16.0 WasmGC 编译器资源。");
  }
  const required = [metadata.module, metadata.runtime, "teavm/mcfpp.wasm-deobfuscator.wasm", "teavm/mcfpp.wasm.teadbg"];
  if (!Array.isArray(metadata.artifacts) || metadata.artifacts.length !== required.length)
    throw new Error("编译器资源清单不完整。");
  for (const path of required) {
    const artifact = metadata.artifacts.find((item) => item.path === path);
    if (!artifact || !/^[a-f0-9]{64}$/.test(artifact.sha256)) throw new Error(`${path} 缺少 SHA-256。`);
    const hash = createHash("sha256");
    let size = 0;
    for await (const chunk of createReadStream(new URL(path, resources))) { hash.update(chunk); size += chunk.length; }
    if (size !== artifact.size || hash.digest("hex") !== artifact.sha256) throw new Error(`${path} 完整性校验失败。`);
  }
  console.log("Playground TeaVM 编译器与运行时 SHA-256 校验通过。");
}

try { await verifyPlayground(); }
catch (error) {
  console.error(`Playground 资源校验失败：${error.message}`);
  console.error("请在 MCFPP 工程运行 gradlew :browser:buildWasmGC，再运行 pnpm playground:prepare。");
  process.exitCode = 1;
}
