# CheerpJ 5.0 / Java 25: JIT aliases a live object with a cast-result temporary after inlining

**Product:** CheerpJ Core, official CDN `https://cjrtnc.leaningtech.com/5.0/loader.js`  
**Runtime:** `version: 25`, default engine (`wasmGC` omitted)  
**Browser / OS:** Microsoft Edge 157.0.4341.30, Windows  
**Native comparison:** Oracle JDK 25.0.4, `-Xverify:all`  
**Date:** 2026-11-04

## Standalone reproduction

The attachment contains **four ordinary Java classes, built from one source file with javac**. Their only module dependency is `java.base`. No third-party library, Kotlin runtime, application classes, compiler framework, patched bytecode, or server-side Java is involved.

The essential structure is:

```java
interface Marker {}
static class Value implements Marker {}
static class Box {
    final Marker value = (Marker) (Object) new Value();
}

static Box createUnrolled() {
    Box first = new Box();
    Object[] values = new Object[239];
    values[0] = new Box();
    values[1] = new Box();
    // ... each index has its own explicit assignment ...
    values[238] = new Box();
    sink = values; // static volatile Object; keeps the allocations observable
    return first;
}
```

`run()` invokes this method 200 times and checks the returned object's field. The full expanded method is in `Repro.java`. The explicit cast through `Object` makes javac emit a valid `CHECKCAST Marker`; no classfile editing is used.

1. Extract the attachment and serve it with HTTP Range support, e.g. `npx http-server . -p 4175 -c-1`.
2. Open `http://127.0.0.1:4175/` in an isolated browser context.
3. Expected: `PASS: 200 calls completed`.
4. Actual: `FAIL: 68 calls completed`, followed by `java.lang.ArrayIndexOutOfBoundsException`.

The page only initializes CheerpJ and calls the Java library:

```js
await cheerpjInit({version: 25, status: "none"});
const lib = await cheerpjRunLibrary("/app/repro.jar");
const Repro = await lib.Repro;
await Repro.run(false);
```

The actual HTML derives its `/app` path from its location, so serving below a subdirectory also works.

## Controls and native verification

- `?count=238`: same source, except the array length is 238 and the last assignment is deleted.
- `?loop=1`: the same 239 assignments and allocations are performed by a loop.
- `?debug=1`: the failing 239-assignment case with runtime diagnostics.

All cases should pass on a native JVM:

```sh
node build.mjs
java -Xverify:all -cp repro.jar Repro
java -Xverify:all -cp repro-238.jar Repro
java -Xverify:all -cp repro.jar Repro loop
```

The build requires JDK 25 and Node.js with no npm packages. It checks the JAR dependencies with `jdeps`, records SHA-256 hashes, and runs native verification. Prebuilt JARs are included; local Java is unnecessary for the browser case.

The reduction established an adjacent boundary: 238 expanded assignments pass, while 239 fail after 68 completed calls. These values describe this exact source and runtime; they are not proposed as a documented runtime limit.

The final standalone artifacts were checked in four new, isolated browser contexts (no request interception or runtime modification):

| Case | Debug | Observed result |
| --- | --- | --- |
| 239 expanded assignments | Off | FAIL after 68 completed calls |
| 238 expanded assignments | Off | PASS, 200 calls |
| 239 assignments in a loop | Off | PASS, 200 calls |
| 239 expanded assignments | On | FAIL after 68 completed calls |

The loop control's first initialization encountered a CDN connection closure while downloading `cj3n25.wasm`. It was retried in another fresh context and passed; both attempts are retained in `browser-results.json`. This download error is separate from the Java execution defect. All four corresponding native checks (both JARs, expanded and loop modes) pass with `-Xverify:all`.

## Incorrect generated JavaScript

The generated code provides a more specific failure than the final Java exception. In the passing 238-assignment reduction, the first `Box` reference and the cast result use separate temporaries:

```js
t255 = {vt: /* Box vtable */, f0: null};
// allocate Value in t11
t5 = /* valid Marker type check on t11, returning 1 */;
t255.f0 = t11;
```

With one additional assignment, the JIT uses `t5` for both live values:

```js
t5 = {vt: /* Box vtable */, f0: null};
// allocate Value in t11
t5 = /* valid Marker type check on t11, returning 1 */;
t5.f0 = t11; // the receiver is now the number 1
```

These excerpts shorten vtable/type-check expressions but preserve the temporary names and assignment order from captured output. Both generated methods use names up through `t255`; the larger method reuses a live temporary instead of assigning a distinct one.

The first invalid operation is therefore an **object-reference overwrite in generated JIT code**: it attempts to write `f0` on the number `1`. Subsequent runtime recovery reaches:

```text
Implicit exception - TypeError: Cannot read properties of undefined (reading 'vt')
    at aAA (https://cjrtnc.leaningtech.com/5.0/cj3.js:1:571635)
```

That interpreter position executes `CHECKCAST`; the runtime exposes the later fault as `ArrayIndexOutOfBoundsException`. Looking only at that final exception obscures the earlier JIT corruption.

The evidence localizes the defect to temporary/register allocation or its exhaustion handling after inlining. **The generated-code defect is observed; whether its internal cause is an 8-bit index overflow, allocation failure, or missing fallback still requires maintainer confirmation.**

## Regression status and scope

No earlier working CheerpJ version has been established for this case. Java 25 is currently [documented as preview](https://cheerpj.com/compatibility/). The default engine is used; WasmGC is outside this report.

The host has a JDK installed for the native comparison. A separate computer without a JDK has not been tested. The browser reproduction does not invoke that installation.

Previous tracker searches included `ArrayIndexOutOfBoundsException` and `constructor JIT`. Historical [#209](https://github.com/leaningtech/cheerpj-meta/issues/209) concerns a different reproduction; I have not established that it is the same defect. A follow-up API search for register allocation/inlining could not be completed because of TLS timeouts; this is not a claim that no duplicate exists.
