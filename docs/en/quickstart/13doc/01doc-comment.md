---
lastUpdated: true
---

# Documentation comments

Write Markdown in consecutive `///` lines before a declaration. IDEA documentation hints can display this content.

```mcfpp
/// # Reward calculation
/// Adds the configured bonus to a score.
///
/// - Input: the current score.
/// - Result: the score plus five.
func addBonus(score: int): int {
    return score + 5
}

func main() {
    print(addBonus(10))
}
```

One space after `///` separates the marker from content. Further indentation and Markdown markers remain. You can use headings, lists, bold text, and inline code.

Describe parameter units, boundaries, and results for functions. Describe field meanings for templates. For MNI, explain compilation work and the generated game behavior.

Use ordinary `//` comments for implementation details. Use `///` for information that helps callers.

## API documentation in code blocks

Hover over a dotted name below to read documentation exported from MCFPP declarations. Click to keep the card open. With a keyboard, Tab to a name, press Enter to open the card, and Escape to close it.

Ordinary MCFPP code blocks automatically show cards for standard-library APIs such as `print`, conversions, entity targets, and reference addresses. Import documentation for a custom library and select it with `api=library-name`; only indexed declarations have cards. Bodies, parameter and return descriptions, and deprecation notices follow the page's language.

```mcfpp api=example symbols=docs:Counter,docs:Counter.read,docs:identity,docs:oldRead
var counter = Counter()
var current = counter.read()
var score = identity(10)
var legacy = oldRead(score)
```

The `identity` card lists both integer and Boolean overloads. The `oldRead` card includes its deprecation notice. Documentation comes from `///` on explicit MCFPP declarations, using the same data format for regular functions, native MNI functions, and MNI macros.

Code blocks look up exported API names and list matching declarations. They do not infer types at the call site. Names inside comments, strings, and literal Minecraft command text do not trigger cards.

### Import a library's documentation

1. Run `mcfpp doc --format json` in the library project.
2. In MCFPPAPI, import the result: `pnpm docs:api <library-output>/docs/docs.json my-library`.
3. Add `api=my-library` after the fence language:

````md
```mcfpp api=my-library
// Use a library type or function here.
```
````

Use `symbols=namespace:Type,namespace:Type.member` to restrict the candidates. A declaration `id` from the exported JSON selects a single overload. Restart or rebuild the site after updating JSON. Once imported, site builds require only Node.js and readers do not load a compiler.

The example source lives in `examples/documentation` in the MCFPP repository. See `scripts/API-HOVERS.md` in this repository for maintenance and regeneration instructions.

## Generate documentation for your project

```sh
mcfpp doc
mcfpp doc --format json --include-private --output api
```

The first command writes `build/docs/index.html` and `build/docs/docs.json` by default. Open the HTML to browse and search offline. `--include-private` includes private declarations and a relative `--output` path starts at the project root. Document your contract with `/// @param` and `/// @return`. Both IDE hovers and exported docs use these comments. Practise cross-file navigation in [example 11](../../examples/11-editor-tour).
