interface CachedFile {
  inodeId: number;
  cacheRefCount: number;
  permType?: number;
  parent?: DirectoryCache;
}

interface DirectoryCache {
  fileCache: Record<string, number>;
  inodeCache: Record<number, CachedFile>;
  setCached(name: string, file: CachedFile): void;
  clearCached(name: string): void;
}

interface RuntimeFilesystem {
  CheerpJFolder?: { prototype: DirectoryCache };
  cjGraceTimeQueue?: Array<CachedFile | null>;
  cjGraceTimeExpire?: () => void;
}

/**
 * CheerpJ 5.0 的 setCached 在替换路径时把 inode 数字传给 decRefCached，
 * 旧 inode 的引用数因此不会减少。仅识别这段已复现的实现，不覆盖其他版本。
 *
 * 目录重命名还有第二个问题：新路径会创建同 inode 的新对象，旧目录路径
 * 仍留在缓存。旧对象的十秒到期回调又会按 inode 数字清除新对象的缓存。
 * 因此目录换对象时先移除旧路径，到期回调只处理仍拥有该 inode 的对象。
 * 所有修正均同步执行，不吞掉其他缓存一致性异常。
 */
export function fixFilesystemReferenceCounting(
  runtime: RuntimeFilesystem = globalThis as RuntimeFilesystem,
): boolean {
  const prototype = runtime.CheerpJFolder?.prototype;
  if (!prototype) return false;
  const original = prototype.setCached;
  const source = Function.prototype.toString.call(original);
  if (!/this\.decRefCached\(\s*fileName\s*,\s*c\[fileName\]\s*\)/.test(source)) {
    return false;
  }

  const originalExpire = runtime.cjGraceTimeExpire;
  const queue = runtime.cjGraceTimeQueue;
  const knownExpiry = originalExpire && queue &&
    /fileData\.inodeId\s*==\s*mount\.fileCache\[f\]/.test(Function.prototype.toString.call(originalExpire));
  if (knownExpiry) {
    runtime.cjGraceTimeExpire = function () {
      const next = queue[0];
      if (next?.parent && next.parent.inodeCache[next.inodeId] !== next) {
        // 该定时器属于已被替换/移除的对象；消费自己的队列位置即可。
        queue.shift();
        return;
      }
      originalExpire();
    };
  }

  prototype.setCached = function (name, file) {
    const previous = this.inodeCache[file.inodeId];
    if (knownExpiry && previous && previous !== file && ((file.permType ?? 0) & 0xf000) === 0x4000) {
      // 目录没有合法的硬链接别名。这些路径属于重命名前的旧对象。
      for (const path of Object.keys(this.fileCache)) {
        if (this.fileCache[path] === file.inodeId) this.clearCached(path);
      }
    }
    if (Object.prototype.hasOwnProperty.call(this.fileCache, name)) {
      this.clearCached(name);
    }
    original.call(this, name, file);
  };
  return true;
}
