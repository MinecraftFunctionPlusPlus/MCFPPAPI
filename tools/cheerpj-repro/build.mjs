import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdtemp, readFile, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve, dirname, basename} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const temporary = await mkdtemp(join(tmpdir(), 'cheerpj-repro-'));
const classes = ['Repro.class', 'Repro$Box.class', 'Repro$Marker.class', 'Repro$Value.class'];
function run(command, args) {
  const result = spawnSync(command, args, {cwd:root, encoding:'utf8', windowsHide:true});
  if (result.error || result.status !== 0) throw new Error(`${command} failed: ${result.error || result.stderr || result.stdout}`);
  return result.stdout + result.stderr;
}
try {
  const source = await readFile(join(root,'Repro.java'),'utf8');
  const results = [run('java',['-version'])];
  const hashes = {};
  for (const count of [239,238]) {
    const java = count === 239 ? source : source.replaceAll('new Object[239]', 'new Object[238]').replace('        values[238] = new Box();\n','');
    if (count === 238 && (java.includes('new Object[239]') || java.includes('values[238] ='))) throw new Error('Boundary control generation failed');
    await writeFile(join(temporary,'Repro.java'),java);
    run('javac',['--release','25','-d',temporary,join(temporary,'Repro.java')]);
    const jar = count === 239 ? 'repro.jar' : 'repro-238.jar';
    run('jar',['--create','--file',join(root,jar),'--main-class','Repro',...classes.flatMap(name=>['-C',temporary,name])]);
    const dependencies = run('jdeps',['--print-module-deps',join(root,jar)]).trim();
    if (dependencies !== 'java.base') throw new Error(`Unexpected dependencies: ${dependencies}`);
    for (const args of [[],['loop']]) {
      const command = ['-Xverify:all','-cp',join(root,jar),'Repro',...args];
      const result = run('java',command);
      if (!result.includes('PASS: 200 calls completed')) throw new Error(result);
      results.push(`java -Xverify:all -cp ${jar} Repro ${args.join(' ')}\n${result}`);
    }
    hashes[jar] = createHash('sha256').update(await readFile(join(root,jar))).digest('hex');
  }
  await writeFile(join(root,'native-output.txt'),results.join('\n'));
  await writeFile(join(root,'box-bytecode.txt'),run('javap',['-c','-p','-classpath',join(root,'repro.jar'),'Repro$Box']));
  await writeFile(join(root,'repro-manifest.json'),JSON.stringify({java:25,cheerpj:'5.0',iterations:200,dependencies:['java.base'],sha256:hashes},null,2)+'\n');
  console.log('Built repro.jar and repro-238.jar; all four native checks passed.');
} finally {
  const target = resolve(temporary);
  if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith('cheerpj-repro-')) throw new Error('Unexpected temporary directory');
  await rm(target,{recursive:true,force:true});
}
