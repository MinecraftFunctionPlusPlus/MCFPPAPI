---
lastUpdated: true
---

# MNI: from a Java method to a datapack function

MNI connects MCFPP with Java. During a build, the compiler invokes Java methods to obtain values or add Minecraft commands. Minecraft later executes the generated datapack.

This page completes a small project: create it, implement Java code, declare a source function, build it, and test it. The example makes `answer()` return `42`.

## 1. Create the project

Prepare JDK 21. Choose **MCFPP MNI** in IDEA, or run:

```sh
mcfpp init hello-mni --mni
cd hello-mni
```

The CLI creates these main files:

```text
hello-mni/
├─ mcfpp.toml
├─ src/main/mcfpp/main.mcfpp
├─ src/main/java/example/mni/Example.java
└─ src/test/java/example/mni/ExampleTest.java
```

`main.mcfpp` contains the caller. `Example.java` contains the Java implementation. `ExampleTest.java` checks the Java calculation. During a build, the CLI prepares Gradle and dependencies. The first preparation needs network access.

## 2. Read the Java implementation

`src/main/java/example/mni/Example.java`:

```java
package example.mni;

import top.mcfpp.annotations.MNIFunction;
import top.mcfpp.core.lang.MCInt;
import top.mcfpp.util.ValueWrapper;

public final class Example {
    public static int answerValue() {
        return 42;
    }

    @MNIFunction(returnType = "int")
    public static void answer(ValueWrapper<MCInt> result) {
        result.set(new MCInt(answerValue(), "answer"));
    }
}
```

The two methods have these roles:

| Method or type | Role in this example |
| --- | --- |
| `answerValue()` | Calculate the ordinary Java integer `42` |
| `@MNIFunction` | Mark a Java entry that MCFPP can bind |
| `MCInt` | Represent the result as a compiler integer |
| `ValueWrapper<MCInt> result` | Deliver the integer result to the MCFPP caller |

The entry uses `public static void`. Java `void` means that this method supplies its result through `result.set(...)`. For MCFPP callers, `answer()` still returns `int`.

## 3. Declare and call the source function

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func answer(): int = example.mni.Example.answer

func main() {
    print(answer())
}
```

The left side declares the MCFPP interface: `answer` takes zero arguments and returns `int`. The right side identifies the Java package `example.mni`, class `Example`, and method `answer`.

This declaration connects the two sides. You can then call `answer()` like an ordinary function.

## 4. Build and run in the game

```sh
mcfpp build
```

The CLI compiles Java files. The compiler invokes the Java entry at the `answer()` call and generates a datapack. The output directory is `build/hello-mni/`.

Copy that directory into the world's `datapacks/` directory. Run these commands in the game:

```mcfunction
reload
function hello-mni:main
```

The chat displays `42`. Java participates during compilation. Minecraft executes the resulting datapack commands.

## 5. Test the Java calculation

`src/test/java/example/mni/ExampleTest.java`:

```java
package example.mni;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ExampleTest {
    @Test
    void answerIs42() {
        assertEquals(42, Example.answerValue());
    }
}
```

```sh
mcfpp test
```

This test checks the Java calculation in `answerValue()`. `mcfpp build` checks Java compilation, source binding, and datapack generation together. Keeping calculations in ordinary Java methods makes them straightforward to unit test.

## Continue reading

- [Parameters and results](./02mni-framework-implementation): accept MCFPP data and process runtime integers.
- [Generate commands from Java](./05access): produce operations that execute in the game.
- [Gradle and test configuration](../12gradle/01gradle-configuration): add Java dependencies and test settings.
- [MNI macros](../mni-macros/overview): generate expressions, loops, and user callbacks for macro libraries.
