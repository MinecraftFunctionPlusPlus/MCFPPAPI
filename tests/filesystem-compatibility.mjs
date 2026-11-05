import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../docs/.vitepress/components/playground/services/filesystem-compatibility.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { fixFilesystemReferenceCounting } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));

// Model the known runtime contract and its number/object argument mismatch.
function Folder() { this.fileCache = {}; this.inodeCache = {}; }
Folder.prototype.decRefCached = function (_, file) {
  file.cacheRefCount--;
  if (file.cacheRefCount === 0) delete this.inodeCache[file.inodeId];
};
Folder.prototype.clearCached = function (name) {
  if (Object.hasOwn(this.fileCache, name)) {
    this.decRefCached(name, this.inodeCache[this.fileCache[name]]);
    delete this.fileCache[name];
  }
};
Folder.prototype.setCached = function (fileName, fileData) {
  const c = this.fileCache;
  fileData.cacheRefCount++;
  // Keep the known source signature for the compatibility guard.
  if (Object.hasOwn(c, fileName)) this.decRefCached(fileName, c[fileName]);
  c[fileName] = fileData.inodeId;
  this.inodeCache[fileData.inodeId] = fileData;
};

const runtime = { CheerpJFolder: Folder, cjGraceTimeQueue: [] };
runtime.cjGraceTimeExpire = function () {
  const fileData = runtime.cjGraceTimeQueue.shift();
  const mount = fileData.parent;
  for (const f in mount.fileCache) {
    if (fileData.inodeId == mount.fileCache[f]) mount.clearCached(f);
  }
};
assert.equal(fixFilesystemReferenceCounting(runtime), true);
assert.equal(fixFilesystemReferenceCounting({ CheerpJFolder: Folder }), false);
assert.equal(fixFilesystemReferenceCounting({}), false);
const folder = new Folder();
const first = { inodeId: 1, cacheRefCount: 0 };
folder.setCached('/a', first);
folder.setCached('/alias', first);
folder.setCached('/a', first);
assert.equal(first.cacheRefCount, 2);
const second = { inodeId: 2, cacheRefCount: 0 };
folder.setCached('/a', second);
assert.equal(first.cacheRefCount, 1);
folder.clearCached('/alias');
folder.clearCached('/a');
assert.equal(first.cacheRefCount, 0);
assert.equal(second.cacheRefCount, 0);
assert.deepEqual(folder.inodeCache, {});
const oldDirectory = { inodeId: 3, cacheRefCount: 0, permType: 0x4000, parent: folder };
const newDirectory = { inodeId: 3, cacheRefCount: 0, permType: 0x4000, parent: folder };
folder.setCached('/before', oldDirectory);
folder.setCached('/after', newDirectory);
assert.equal(oldDirectory.cacheRefCount, 0);
assert.equal(Object.hasOwn(folder.fileCache, '/before'), false);
runtime.cjGraceTimeQueue.push(oldDirectory, newDirectory);
runtime.cjGraceTimeExpire();
assert.equal(folder.inodeCache[3], newDirectory); // Old timer cannot evict a new inode owner.
runtime.cjGraceTimeExpire();
assert.equal(newDirectory.cacheRefCount, 0);
assert.deepEqual(folder.inodeCache, {});
console.log('CheerpJ cache replacement, aliases, directory rename and timer ownership passed.');
