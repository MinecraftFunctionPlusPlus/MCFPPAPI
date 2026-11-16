# MCFPP API hover cards

VitePress uses TextMate grammars and a Shiki transformer hook. Ordinary `mcfpp` fences use the `mcfpp-lang` core catalog automatically. `api=<catalog>` selects a custom catalog for `mcfpp`, `kotlin`, or `kt` fences. Matching names receive focusable spans with documentation rendered at build time. `ApiHover.vue` opens one shared Vue card, teleported to `body` so a code block's scrolling container cannot clip it. No compiler, documentation fetch, or language server runs in the reader's browser.

## Import and author

Generate a library's `docs.json` using `mcfpp doc --format json`, then import it:

```powershell
pnpm docs:api <path-to-docs.json> my-library
pnpm docs:dev
```

This validates `schemaVersion: 1` and writes `docs/assets/api/my-library.json`. Keep that generated file in Git so a normal site build needs no JDK or adjacent compiler checkout. The importer accepts output from ordinary functions, explicit native MNI declarations, and explicit MNI macro declarations without separate handwritten documentation.

````md
```mcfpp api=my-library
// Library code
```
````

- `api=one,two` uses multiple catalogs; bare `api` uses imported catalogs for the fence's language.
- `symbols=demo:Counter,demo:Counter.read` limits names by namespace and owner.
- `symbols=s-<id-from-docs.json>` selects an exact declaration, including an overload.
- Missing catalogs and unsupported JSON schemas fail the build.
- Plain `mcfpp` fences show core APIs, including `print`, conversions, entity targets, reference addresses, and `tp`. Demo and custom libraries are not enabled globally.
- `no-api` disables cards on an individual fence. A catalog with `default: true` participates in ordinary MCFPP fences.

The core catalog is collected from explicit declarations in `MCFPP/src/main/mcfpp/lang` using the compiler's ANTLR parser and shared `SourceDocumentation` collector. It preserves `///`, signatures, parameter types, source positions, and package identity without compiling bodies or substituting Kotlin implementation docs. Regenerate it with:

```powershell
# In MCFPP:
.\gradlew.bat exportMcfppApiDocs
# In MCFPPAPI:
pnpm docs:api ../MCFPP/build/docs/mcfpp-api.json mcfpp-lang
pnpm docs:i18n
```

If the local MCFPM snapshot dependencies are supplied by a sibling checkout, add `--include-build ../Mcfpm` to the Gradle command. A normal website build uses the committed catalog and needs no compiler checkout.

## Kotlin and KDoc

The `kotlin-mni` catalog contains public/protected Kotlin declarations from `top.mcfpp.mni.api`, `top.mcfpp.annotations`, and `Command.kt`. Kotlin cards show these host APIs' KDoc. MCFPP cards show `///` on explicit MCFPP declarations, including native MNI and macro bindings.

````md
```kotlin api=kotlin-mni
context.quote.block {
    val total = local("total", literal(0))
    total += 1
}
```
````

`kt api=kotlin-mni` is equivalent. Kotlin name filters use dots, for example `symbols=top.mcfpp.mni.api.CodeScope.literal`, or an exact exported declaration ID. A catalog's optional `language` field is `kotlin` or `mcfpp`; older exports without it are MCFPP. A catalog explicitly used with the wrong fence language fails the build.

Regenerate from the adjacent MCFPP checkout:

```powershell
# In MCFPP (requires the project's JDK):
.\gradlew.bat exportKotlinApiDocs
# In MCFPPAPI:
pnpm docs:api ../MCFPP/build/docs/kotlin-api.json kotlin-mni
```

The exporter uses the project's Kotlin PSI parser to read source declarations, KDoc, annotations, extension receivers, and primary-constructor properties. It excludes private/internal declarations and function implementations, and derives stable IDs from package identity, owner, and declaration signature. KDoc `@property` text is retained on constructor properties, and `@Deprecated` annotations provide deprecation notices. Signatures reflect written source; inferred return types are not calculated. Symbol links retain their text. The generated JSON is checked into this website so ordinary site builds need only Node.js.

Restart the dev server after adding or updating a catalog. Documentation is Markdown with raw HTML disabled. Tags, including parameters, returns, and deprecation, render inside each declaration card. Unresolved KDoc references retain their text; they do not become links to missing pages.

## Matching boundary

MCFPP and unprepared Kotlin snippets use **name lookup**. TextMate scopes exclude comments, string literals, and literal command text, while allowing code inside interpolation. Prepared Kotlin snippets additionally apply the syntax filtering below. Unknown context can leave several matching overloads or owners. Use `symbols=` to restrict a fence when needed; the selection applies to the whole fence.

Exact member resolution, local shadowing, generic substitution, and selecting the called overload require a compiler-produced occurrence map (`start`, `length`, declaration ID) for each snippet. The compiler's current `docs.json` describes declarations and has no such map. That can later replace the matching stage while retaining the catalog and card UI.

The Kotlin integration additionally uses the preparation stage below. It documents indexed MCFPP host APIs; Kotlin/JDK standard-library symbols require their own catalog.

## Localized documentation and IDEA reuse

`docs/assets/api-i18n/zh.json` and `en.json` contain plain Markdown translations indexed by `documentationKey`. The theme chooses the page's locale for the body, kind names, tags, and controls. Signatures and identifiers retain their source spelling. Missing translations or entries whose `sourceHash` no longer matches fall back to source documentation.

The included translations cover every declaration in the published catalogs: the public/protected Kotlin MNI API, annotations, Command API, MCFPP core API, and documentation example. Bodies and all tag content are supplied in both Chinese and English; signatures, symbol references, and version numbers retain their spelling. Empty source documentation stays empty. Edit the exact-source dictionaries in `scripts/api-doc-translations*.mjs`, then run `pnpm docs:i18n`. The generator rejects missing translations. `pnpm docs:i18n:check`, also run by `docs:build`, rejects missing or stale locale artifacts. This generates frontend-independent JSON; it does not translate content at runtime.

The shared contract is `schemaVersion: 1`, `locale: zh|en`, and `symbols[documentationKey] = { sourceHash, markdown?, tags? }`. Tags retain their structural `name` and `subject`; only `content` is translated. The hash is SHA-256 of UTF-8 `JSON.stringify({markdown, tags})` from the original catalog, with each tag normalized to the ordered fields `{name, subject: null|string, content: string}`. Kotlin keys use `kotlin:<package>.<owner>.<receiver>.<name>(<parameter types>)`; non-callables omit the parentheses. Parameter names and documentation changes do not change this key. The catalog's declaration `id` still distinguishes a specific exported signature.

The IDEA follow-up can package the same catalog and locale files, map resolved symbols to `documentationKey`, and use the IDE locale with the same hash check and source fallback. IDEA's existing Quick Documentation provider already uses reference resolution. This website change does not replace it or install a Kotlin documentation provider in the plugin.

## Preparing Kotlin candidates

Run `pnpm docs:analyze` after editing Kotlin API snippets. It batches fences through the adjacent compiler's `analyzeKotlinApiSnippets` task using Kotlin PSI and commits the result to `docs/assets/api-analysis/kotlin.json`. Normal site builds still need only Node.js.

Facts are indexed by the SHA-256 of LF-normalized snippet source with trailing whitespace removed. Reference ranges use UTF-16 offsets, matching Java/Kotlin PSI and JavaScript strings. The renderer uses annotation ownership, import aliases, local shadowing, required/default/vararg arguments, named arguments, primitive literal types, explicit receiver types, receiver chains, and indexed supertypes to remove inapplicable candidates. A `context=MacroContext` fence attribute supplies the type of `context` for standalone DSL examples.

Unknown types retain candidates. A missing cache entry emits a build warning and uses name lookup; syntax errors also retain name candidates. Facts describe syntax and known catalog types: they do not implement Kotlin's complete generic inference, implicit receiver priority, visibility, import scope, or extension overload rules. A single remaining candidate is the catalog match under known constraints; Kotlin semantic analysis determines whether the call is valid.

Regeneration order when Kotlin API source changes:

```powershell
# MCFPP:
.\gradlew.bat exportKotlinApiDocs
# MCFPPAPI:
pnpm docs:api ../MCFPP/build/docs/kotlin-api.json kotlin-mni
pnpm docs:i18n
pnpm docs:analyze
pnpm test:api-hover
pnpm docs:build
```

## Regenerate the included example

In the adjacent MCFPP repository:

```powershell
.\gradlew.bat run --args="--project examples/documentation doc --format json"
```

Then in this repository:

```powershell
pnpm docs:api ../MCFPP/examples/documentation/build/docs/docs.json example
pnpm test:api-hover
pnpm test:highlight
pnpm playground:typecheck
pnpm docs:build
```

Preview `/zh/quickstart/01project/01create-project.html` or its English counterpart and hover `print` in the first-function example to check automatic MCFPP cards. `/zh/quickstart/11doc/01doc-comment.html` and `/en/quickstart/13doc/01doc-comment.html` exercise the custom catalog. Check hover and moving into the card, overloads, deprecation, keyboard focus/Escape, touch/click, dark mode, scrolling, and navigation cleanup. Code copying must contain only the source, not card text.
