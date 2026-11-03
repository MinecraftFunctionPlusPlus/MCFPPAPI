---
lastUpdated: true
---

# Inline functions

Place `inline` before `func` to compile the function body at its call site.

```mcfpp
inline func announceReady() {
    /say Ready
}

func main() {
    announceReady()
}
```

Current inline examples use `void` command helpers. Use an ordinary `func` for calculations with a result, such as [integer addition](./01define-and-call).

Several calls can generate several copies of the commands. Compare [IR output](../01project/04build-and-ir) before choosing which functions to inline.

Use [function values and lambdas](./05lambda) to pass behavior as an argument.
