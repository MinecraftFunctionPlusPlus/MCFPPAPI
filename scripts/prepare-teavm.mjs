import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const source = process.argv[2]
  ? pathToFileURL(resolve(process.argv[2]) + "/")
  : new URL("../../MCFPP/browser/build/generated/teavm/wasm-gc/", import.meta.url);
const target = new URL("../docs/public/playground/teavm/", import.meta.url);
const names = ["mcfpp.wasm", "mcfpp.wasm-runtime.js", "mcfpp.wasm-deobfuscator.wasm", "mcfpp.wasm.teadbg"];

// Read and validate everything before publishing a coherent set of compiled resources.
const artifacts = await Promise.all(names.map(async (name) => {
  const bytes = await readFile(new URL(name, source));
  if (name.endsWith(".wasm") && bytes.subarray(0, 4).toString("hex") !== "0061736d")
    throw new Error(`${name} is not a WebAssembly module`);
  // Node 20 is sufficient for the docs toolchain but lacks finalized WasmGC support.
  // Validate here when supported; browser acceptance remains required for every build.
  if (name === "mcfpp.wasm" && Number(process.versions.node.split(".")[0]) >= 22)
    await WebAssembly.compile(bytes, { builtins: ["js-string"] });
  return { path: `teavm/${name}`, size: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
}));
await mkdir(target, { recursive: true });
for (const name of names) await copyFile(new URL(name, source), new URL(name, target));
await writeFile(new URL("../teavm.json", target), JSON.stringify({
  engine: "teavm-wasm-gc", teavm: "0.16.0", version: "0.1.0", kernelApi: 1,
  minecraft: "1.21.8", module: "teavm/mcfpp.wasm", runtime: "teavm/mcfpp.wasm-runtime.js", artifacts,
}, null, 2) + "\n");
console.log(`Prepared TeaVM compiler from ${fileURLToPath(source)}`);
for (const item of artifacts) console.log(`${item.path}: ${item.size} bytes, SHA-256 ${item.sha256}`);
