---
lastUpdated: true
---

# Comments

An ordinary comment starts with `//` and continues to the end of the line. Prefix each line of a longer explanation with `//`.

A documentation comment starts with `///` before a declaration. Consecutive documentation lines form a Markdown document.

```mcfpp
/// Add two integer scores.
/// The result is the sum of both inputs.
func add(left: int, right: int): int {
    // Keep the calculation in one place.
    return left + right
}

func main() {
    print(add(2, 3))
}
```

Documentation comments support Markdown such as `**bold**`, lists, and code. Explain input meanings and results instead of repeating the function name.

Version conditions use `#if`, `#elif`, `#else`, and `#endif`. The [version processor](../minecraft-versions) handles those lines.

See [Documentation comments](../13doc/01doc-comment) for more examples.
