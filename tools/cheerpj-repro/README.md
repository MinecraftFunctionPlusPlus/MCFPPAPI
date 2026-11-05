# Standalone CheerpJ JIT reproducer

This reproducer has four plain Java classes and depends only on `java.base`. It needs no application release, Kotlin, NBT library, Minecraft code, Gradle, compatibility overlay or backend service.

Extract the ZIP and serve its directory with HTTP Range support:

```sh
npx http-server . -p 4175 -c-1
```

Open <http://127.0.0.1:4175/>. The default case expands 239 assignments in one method and fails after 68 completed calls on CheerpJ 5.0 / Java 25. `?count=238` removes the final assignment and reduces the array length by one; `?loop=1` performs the same 239 assignments using a loop. Both controls should complete 200 calls. `?debug=1` enables runtime diagnostics. Reload the page between cases; an isolated browser context is preferable when collecting evidence.

Rebuild or compare with native Java using JDK 25 and Node.js (no npm dependencies):

```sh
node build.mjs
java -Xverify:all -cp repro.jar Repro
java -Xverify:all -cp repro.jar Repro loop
java -Xverify:all -cp repro-238.jar Repro
```

`build.mjs` compiles `Repro.java` with ordinary `javac --release 25`, builds both JARs, checks their only module dependency is `java.base`, runs native verification, and records SHA-256 hashes. It produces the 238 control by changing the array lengths and deleting `values[238] = new Box();`; it does not transform classfiles.

The repeated source lines are intentional. Replacing them with a loop removes the JIT expansion that triggers this defect. The cast through `Object` keeps an ordinary, valid `CHECKCAST` instruction in the constructor.

In the hosting repository, `pnpm playground:repro` runs this standalone build and packages only these reproduction files in `output/cheerpj-issue.zip`. The old application-specific probe is not included. `ISSUE.md` is a draft and has not been submitted.

The source directory is `tools/cheerpj-repro/`, outside the website's public assets. From the repository root, serve it with `npx http-server tools/cheerpj-repro -p 4175 -c-1` and open <http://127.0.0.1:4175/>.
