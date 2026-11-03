---
lastUpdated: true
---

# Generate Minecraft commands from Java

The previous page returned integer values. This page generates an operation: display a message when the game calls `ready()`.

## Complete implementation

`src/main/java/example/mni/Messages.java`:

```java
package example.mni;

import top.mcfpp.annotations.MNIFunction;
import top.mcfpp.model.function.Function;

public final class Messages {
    @MNIFunction
    public static void ready() {
        Function.addCommand("say MNI is ready");
    }
}
```

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func ready() = example.mni.Messages.ready

func main() {
    ready()
}
```

Run `mcfpp build`, load the datapack, and call `main`. Minecraft executes `say MNI is ready`.

## What happens in each stage

During compilation, the compiler processes the source call to `ready()` and invokes `Messages.ready`. `Function.addCommand` adds a command to the function being generated.

During play, Minecraft executes that generated command. Each call to `main` executes it. The Java entry completes its work during compilation.

`Function.addCommand` accepts the command body. Start the string with a command name, such as `say`. Selectors and coordinates use the execution context active when the command runs.

## Java conditions and game conditions

A source condition controls whether the game executes a command. Replace `main` with this complete source file:

```mcfpp
func ready() = example.mni.Messages.ready

func main() {
    external enabled: bool = true
    if (enabled) {
        ready()
    }
}
```

During compilation, the compiler places the generated command in the corresponding branch. During play, `enabled` determines whether that branch executes.

A Java `if` inside the entry selects generated commands from data available to Java during compilation. Use it to select fixed content from project configuration.

## When to use this entry

You can write fixed commands directly in [MCFPP source](../02base/05original-command). Use MNI when you need Java libraries, build configuration, or resource preparation before generating commands.

Read [Command API](/en/api/class/command) to combine command parts. Continue with [MNI macros](../mni-macros/overview) to generate loops, expressions, or user callbacks.
