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
