import { spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../', import.meta.url));
const reproduction = resolve(repository, 'tools/cheerpj-repro');
await mkdir(resolve(repository,'output'), {recursive:true});
function run(command, args, capture = false) {
  const result = spawnSync(command, args, {stdio:capture?'pipe':'inherit',encoding:'utf8',windowsHide:true});
  if (result.error || result.status !== 0) throw new Error(`${command} failed`);
  if (capture) { process.stdout.write(result.stdout || ''); process.stderr.write(result.stderr || ''); }
  return result;
}
run('node', [resolve(reproduction,'build.mjs')]);
// Package the standalone source, browser page and generated evidence explicitly.
const files = ['index.html','Repro.java','build.mjs','README.md','ISSUE.md','repro.jar','repro-238.jar','native-output.txt','box-bytecode.txt','repro-manifest.json'];
run('jar', ['--create','--file',resolve(repository,'output/cheerpj-issue.zip'),...files.flatMap(name=>['-C',reproduction,name])]);
console.log('Issue attachment: output/cheerpj-issue.zip');
