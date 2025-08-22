---
lastUpdated: true
---

# Top-level statements

:::warning
This content has been translated by AI. We welcome native speakers to help improve the translation.
:::

MCFPP allows writing statements at the start of a file without defining a function — these are top-level statements. Top-level statements live in an implicit function (one per file), which cannot be called externally and has return type `void`.

```mcfpp
print("Top statement");

func main(){
    print("Function");
}
```

After compilation two functions are generated: the explicit main and the implicit top-level function.

Top-level statements must appear at the beginning of a file, before any function or class definitions. They may call other functions and use classes declared in the same file; variables declared in the top-level are available to other functions in that file.

```mcfpp
var qwq = "qwq";

main();

func main(){
    print(qwq);
}
```

Top-level statements always receive a `minecraft:load` tag and therefore run once when the datapack is loaded. They are suitable for initialization.

Tip: the top-level function is named `<namespace>:<filename>__top__` and is placed in the corresponding namespace at compile time. Although you can call it like any function, doing so is discouraged because invoking an implicitly declared function makes code harder to read and is not the intended use of top-level statements.
