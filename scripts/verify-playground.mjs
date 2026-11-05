import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';

const resources = new URL('../docs/public/playground/', import.meta.url);

/** 构建前核对随站点保存的资源，防止发布缺少 JAR 或内容不完整的 Playground。 */
async function verifyPlayground() {
  const metadata = JSON.parse(await readFile(new URL('compiler.json', resources), 'utf8'));
  if (metadata.version !== '0.1.0' || metadata.java !== 25 || metadata.minecraft !== '1.21.8' || metadata.kernelApi !== 1
    || metadata.jar !== 'lib/MCFPP-0.1.0.jar'
    || metadata.compatibility?.jar !== 'lib/cheerpj-compat-0.1.0.jar'
    || metadata.compatibility.fix !== 'reflective-nbt-dictionary-allocation') {
    throw new Error('需要完整的 MCFPP 0.1.0 / Java 25 编译器及 CheerpJ 兼容资源。');
  }

  const artifacts = [metadata, metadata.compatibility];
  for (const artifact of artifacts) {
    if (!/^[a-f0-9]{64}$/.test(artifact.sha256 ?? '')) {
      throw new Error(`${artifact.jar} 缺少有效的 SHA-256。`);
    }
    const hash = createHash('sha256');
    for await (const chunk of createReadStream(new URL(artifact.jar, resources))) {
      hash.update(chunk);
    }
    if (hash.digest('hex') !== artifact.sha256) {
      throw new Error(`${artifact.jar} 的 SHA-256 校验失败。`);
    }
  }
  console.log('Playground 编译器与兼容补丁 SHA-256 校验通过。');
}

try {
  await verifyPlayground();
} catch (error) {
  console.error(`Playground 资源校验失败：${error.message}`);
  console.error('请运行 pnpm playground:prepare [0.1.0 发布目录或完整 JAR 路径] 重新准备资源。');
  process.exitCode = 1;
}
