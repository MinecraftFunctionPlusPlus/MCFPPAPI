---
lastUpdated: true
---

# Variables

:::warning
This content has been translated by AI. We welcome native speakers to help improve the translation.
:::

## Declaring variables

As in other languages, you can declare variables in MCFPP to store, pass and process data.

Typical declaration:

```mcfpp
#var <identifier> [as <type>] [= expression or value]
var i as int = 5;
var b as int = i * 6;

#type inferred
var j = 5; # j is inferred as int
var k = 5.0; # k is inferred as float
var i; # [!code error] # error: missing initializer, cannot infer
```

Identifiers may contain letters and digits. In the same scope a name can be declared only once.

## Variable types

MCFPP has primitive and composite types. Primitives are built-in; composite types (classes, templates, etc.) are user-defined. Current primitives:

|Type|Description|Example|
|-|-|-|
|int|integer|`1`,`114514`,`-5`|
|float|single-precision float|`2.5`,`1.0`,`9.5e6`|
|bool|boolean|`true`,`false`|
|nbt|NBT data|`"a":{"b":"c"}`,`"a":[1,2,3,4]`|
|list|list|`[1,2,3,4]`,`["a","b","c"]`|
|dict|dictionary|`{"a":1,"b":2,"c":3}`|
|map|richer map with more features|same as above|
|string|string (NBT string tag)|`"mcfpp"`,`"qwq"`|
|text|text components|`"mcfpp"`,`{"text":"mcfpp","color":"#114514"}`|
|entity|single entity (stores UUID)|—|
|selector|target selector|`@a`,`@p`|

Brief descriptions (expandable):

::: details int
int is the basic integer type. It can be positive, negative, or zero, and supports decimal, binary, octal, hex, etc. int values are stored as scoreboard variables, so they have scoreboard size limits.
:::

::: details float
A floating‑point number with single precision. Supports decimal and scientific notation. MCFPP float ops rely on Xiaodou's math library. Float operations are implemented via scoreboard math and have modest overhead.
:::

::: details bool
Boolean with values `true` or `false`. Stored as a scoreboard variable.
:::

::: details nbt
NBT data, often acting as an NBT pointer (stores an NBT path). Many composite types (list, map, etc.) are based on NBT operations.
:::

::: details list
List type. Implements most ArrayList methods from Java; stored as an NBT list.
:::

::: details dict
Dictionary stored as an NBT compound. Due to Minecraft limits, dict supports basic key insert/remove but not iteration. Use map for more operations.
:::

::: details map
A richer wrapper over dict with more features (implements most HashMap methods). Provides more functionality at the cost of additional overhead.
:::

::: details string
String type (NBT string tag).
:::

::: details text
Raw JSON text. Unlike string, text can include formatting (color, bold, etc.). Stored as an NBT compound.
:::

::: details entity
Represents a single entity. Stored as a UUID integer NBT array.
:::

::: details selector
Represents a target selector. Stored as a string.
:::

## Variable modifiers

Modifiers express variable properties: dynamic, const.

- dynamic

If a variable is a literal (e.g. `int i = 5;`), the compiler may optimize it (e.g. `i += 7` becomes 12 at compile time instead of scoreboard commands). `dynamic` forces runtime/dynamic behavior even for literals. Example: `dynamic int i = 5;` will not be optimized away.

- const

`const` marks a compile-time constant whose value is fixed at compile time and cannot change. It must be initialized on declaration.

## Compile-time optimizations

The compiler tracks compile-time-known values and optimizes accordingly. When a variable is assigned a literal, the compiler remembers its value until tracking is lost.

```mcfpp
var i = 5;  # compiler records i = 5
i += 7;     # compiler treats i as 12; no scoreboard commands emitted
var j = i;  # compiler also knows j's value

dynamic var x as int;
j = x;      # compiler loses precise value for j
j += 1;     # compiler will emit scoreboard commands
```
