---
lastUpdated: true
---

# MNI parameters and results

This page follows [MNI introduction](./01mni-framework). Continue with the same project. The Java entry will receive integers and return their sum.

## Receive integers with MCInt

`src/main/java/example/mni/Arithmetic.java`:

```java
package example.mni;

import top.mcfpp.annotations.MNIFunction;
import top.mcfpp.core.lang.MCInt;
import top.mcfpp.util.ValueWrapper;

public final class Arithmetic {
    @MNIFunction(normalParams = {"int", "int"}, returnType = "int")
    public static void add(
            MCInt left, MCInt right, ValueWrapper<MCInt> result) {
        result.set((MCInt) left.plus(right));
    }

    @MNIFunction(
        readOnlyParams = {"int"},
        normalParams = {"int"},
        returnType = "int"
    )
    public static void addBonus(
            MCInt bonus, MCInt score, ValueWrapper<MCInt> result) {
        result.set((MCInt) score.plus(bonus));
    }
}
```

`add` receives two ordinary integers. `addBonus` receives a fixed reward and an ordinary score. Both return a result through `ValueWrapper<MCInt>`.

The central operation in `add` is:

```java
result.set((MCInt) left.plus(right));
```

`left.plus(right)` asks the compiler to perform MCFPP integer addition. The compiler produces the appropriate calculation and supplies its result to `result`.

## Declare the two interfaces

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func add(left: int, right: int): int = example.mni.Arithmetic.add
func addBonus<bonus: int>(score: int): int = example.mni.Arithmetic.addBonus

func main() {
    external count: int = 2
    print(add(count, 3))
    print(addBonus<5>(count))
}
```

Run `mcfpp build`. Then call `main` in the game. The outputs are `5` and `7`.

`external count` uses game runtime storage. During compilation, Java receives a compiler object that describes access to this integer. Generated addition commands read the actual integer when the datapack executes.

`<5>` supplies the reward during compilation. Read [Compilation parameters](../07generic/01concrete_var) for the difference between angle brackets and parentheses.

## Match the three parameter descriptions

An ordinary MNI wrapper describes its parameters in three corresponding places:

| MCFPP declaration | Java annotation | Java method parameters |
| --- | --- | --- |
| `left: int, right: int` | `normalParams = {"int", "int"}` | `MCInt left, MCInt right` |
| `<bonus: int>` | `readOnlyParams = {"int"}` | `MCInt bonus` before ordinary parameters |
| `: int` | `returnType = "int"` | Final `ValueWrapper<MCInt> result` |

The source declaration defines the caller's interface. The annotation describes the Java entry signature. Java parameters use corresponding compiler types in declaration order.

For these free functions, the order is: readonly parameters, ordinary parameters, then the result wrapper. Member entries also receive a caller object before the result wrapper. Read [MNIFunction API](/en/api/annotation/mnifunction) for those signatures.

## Where Java int and MCInt apply

| Form | Meaning | Typical use |
| --- | --- | --- |
| Java `int` | An integer that Java currently holds | Configuration, ordinary calculations, and tests |
| Java `MCInt` | An MCFPP integer value represented by the compiler | Source inputs and generated integer operations |
| MCFPP `int` | An integer type in the datapack program | Variable, parameter, and result declarations |

`MCInt` can represent either a known integer or runtime data. Compiler operations such as `plus` support both inputs through the same entry. Reading an ordinary Java integer requires a value known during compilation.

## Common value type mappings

Use the corresponding compiler value class for other inputs and results. Import the classes listed below:

| MCFPP type | Java class |
| --- | --- |
| `int` | `top.mcfpp.core.lang.MCInt` |
| `float` | `top.mcfpp.core.lang.MCFloat` |
| `bool` | `top.mcfpp.core.lang.bool.ScoreBool` |
| `string` | `top.mcfpp.core.lang.nbt.MCString` |

For example, use `MCString input` for a string input and `ValueWrapper<MCString> result` for a string result. The annotation and source declaration still use `string`.

## Return a value or generate an operation

An entry with a result calls `result.set(...)` on every successful completion path. This delivers an MCFPP value to the caller. The Java method itself still returns `void`.

Read [Generate commands](./05access) for messages and other operations without results. Read [MNIFunction API](/en/api/annotation/mnifunction) for annotation field details.
