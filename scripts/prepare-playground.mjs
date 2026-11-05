import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const version = '0.1.0';
const filename = `MCFPP-${version}.jar`;
const inputPath = process.argv[2]
  ? resolve(process.argv[2])
  : fileURLToPath(new URL('../../MCFPP/build/releases/0.1.0/', import.meta.url));
const destination = fileURLToPath(new URL('../docs/public/playground/', import.meta.url));
const compatibilitySources = fileURLToPath(new URL('./playground-compat/', import.meta.url));
const compatibilityClasses = fileURLToPath(new URL('../output/playground-compat/classes/', import.meta.url));

function javaTool(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', windowsHide: true });
  if (result.error || result.status !== 0) {
    throw new Error(`${command} 执行失败；生成 CheerpJ 兼容补丁需要 PATH 中的 JDK 25（java 和 javac）。`);
  }
}

try {
  // 发布目录按清单校验；本地优化构建允许直接指定 JAR，保留原发布清单的真实性。
  const localJar = extname(inputPath).toLowerCase() === '.jar';
  let expectedSha256;
  if (localJar) {
    if (basename(inputPath) !== filename) throw new Error(`需要指定完整的 ${filename}，不能使用 plain JAR。`);
  } else {
    const manifest = JSON.parse(await readFile(resolve(inputPath, 'release-manifest.json'), 'utf8'));
    expectedSha256 = manifest.sha256?.[filename];
    if (manifest.schema !== 1 || manifest.version !== version || manifest.java !== 25 || !/^[a-f0-9]{64}$/.test(expectedSha256 || '')) {
      throw new Error('发布清单与指定的 MCFPP 0.1.0 / Java 25 发布包不一致。');
    }
  }
  const source = localJar ? inputPath : resolve(inputPath, filename);
  const inventory = spawnSync('jar', ['tf', source], { encoding: 'utf8', windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  if (inventory.error || inventory.status !== 0
    || !inventory.stdout.split(/\r?\n/).includes('top/mcfpp/api/library/PlaygroundCompilerApi.class')) {
    throw new Error('JAR 缺少可复用编译内核 API，请先在编译器工程运行 playgroundJar。');
  }
  const hash = createHash('sha256');
  let bytes = 0;
  for await (const chunk of createReadStream(source)) {
    hash.update(chunk);
    bytes += chunk.length;
  }
  const sha256 = hash.digest('hex');
  if (expectedSha256 && sha256 !== expectedSha256) throw new Error(`${filename} 的 SHA-256 校验失败。`);
  // The compiler's playgroundJar task records the unchanged source artifact separately.
  let provenance;
  if (localJar) {
    try {
      provenance = JSON.parse(await readFile(`${source}.source.json`, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    if (provenance && (provenance.schema !== 1 || provenance.packaging !== 'stdlib-chunks/1'
      || provenance.sha256 !== sha256 || !/^[a-f0-9]{64}$/.test(provenance.sourceSha256 || ''))) {
      throw new Error('紧凑 JAR 的来源清单无效或与产物不一致，请重新运行 playgroundJar。');
    }
  }
  await mkdir(resolve(destination, 'lib'), { recursive: true });
  await copyFile(source, resolve(destination, 'lib', filename));
  const copiedSha256 = createHash('sha256').update(await readFile(resolve(destination, 'lib', filename))).digest('hex');
  if (copiedSha256 !== sha256) throw new Error('JAR 复制前后内容发生变化，请等待本地构建结束后重试。');
  const compatibilityJar = 'lib/cheerpj-compat-0.1.0.jar';
  await mkdir(compatibilityClasses, { recursive: true });
  javaTool('javac', ['--release', '25', '-cp', source, '-d', compatibilityClasses,
    resolve(compatibilitySources, 'CheerpJCompatibility.java')]);
  javaTool('java', ['--source', '25', resolve(compatibilitySources, 'BuildCompatibility.java'), source,
    resolve(compatibilityClasses, 'top/mcfpp/playground/CheerpJCompatibility.class'), resolve(destination, compatibilityJar)]);
  const compatibilitySha256 = createHash('sha256').update(await readFile(resolve(destination, compatibilityJar))).digest('hex');
  await writeFile(resolve(destination, 'compiler.json'), JSON.stringify({
    version, java: 25, minecraft: '1.21.8', kernelApi: 1, jar: `lib/${filename}`, sha256, bytes,
    ...(provenance && { sourceSha256: provenance.sourceSha256, packaging: provenance.packaging }),
    compatibility: { jar: compatibilityJar, sha256: compatibilitySha256, fix: 'reflective-nbt-dictionary-allocation' },
  }, null, 2) + '\n');
  console.log(`已准备 MCFPP ${version}：${(bytes / 1024 / 1024).toFixed(1)} MiB，复制前后 SHA-256 一致：${sha256}`);
} catch (error) {
  console.error(`Playground 资源准备失败：${error.message}`);
  console.error('用法：pnpm playground:prepare [发布目录或完整的 MCFPP-0.1.0.jar 路径]');
  process.exitCode = 1;
}
