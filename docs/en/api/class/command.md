---
lastUpdated: true
---

# Command: compose command fragments

`top.mcfpp.command.Command` stores command fragments. `Function.addCommand` places a command in the function currently being compiled.

```java
package example.mni;

import top.mcfpp.annotations.MNIFunction;
import top.mcfpp.command.Command;
import top.mcfpp.model.function.Function;

public final class Messages {
    @MNIFunction
    public static void ready() {
        Command command = new Command("say").build("Ready");
        Function.addCommand(command);
    }
}
```

This generates `say Ready`. `build(String)` adds a space before the fragment. Use `build(text, false)` when text must directly follow the preceding fragment.

| Operation | Purpose |
| --- | --- |
| `new Command(text)` | Create the first fragment |
| `build(text)` | Add a fragment with a space |
| `build(text, false)` | Add adjacent text |
| `build(otherCommand)` | Combine command fragments |
| `Function.addCommand(command)` | Add the command to the current function |

Java receives the command body, such as `say Ready`. MCFPP source syntax handles the slash in `/say Ready`.

Runtime arguments can need command macros and entity selector checks. Use matching backend operations or macro builders for those cases. Fixed text commands can use the example above.

Inspect final commands with [Dump IR](/en/quickstart/01project/04build-and-ir).
