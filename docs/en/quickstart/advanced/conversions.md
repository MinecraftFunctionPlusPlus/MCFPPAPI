---
lastUpdated: true
---

# Number conversion and type views

Number conversion changes the representation of a value. For example, convert a speed to an integer or store an integer as an NBT byte.

## Convert numbers with functions

`toInt`, `toFloat`, `toByte`, `toShort`, `toLong`, and `toDouble` return a value of the specified type.

```mcfpp
func main() {
    var speed = 3.75
    var whole = toInt(speed)
    var fraction = toFloat(whole)
    print(whole)
    print(fraction)
    print(toByte(128))
    print(toShort(65535))
}
```

The results are `3`, `3.0`, `-128`, and `-1`. Conversion from a floating-point number to an integer truncates toward zero. Conversion to `byte` or `short` keeps the low bits and interprets them as a signed integer.

Conversions between `long` or `double` and runtime floating-point values use Minecraft 26.3 number features. Set `version = "26.3"` for projects that use these conversions.

## Create a type view with as

`as` accesses the same storage through the specified type. Use it for union types, `any`, and container views. Use the conversion functions above to change a numeric representation.

Here, `view` and `source` access the same list. A write through `view` changes the value visible through `source`.

```mcfpp
func main() {
    var source = [1, 2, 3]
    var view = source as list<int>
    view[0] = 9
    print(source[0])
}
```

Ordinary assignment copies the value. Compare `copy` in this example:

```mcfpp
func main() {
    var source = [1, 2, 3]
    var copy = source
    copy[0] = 9
    print(source[0])
}
```

This example prints `1`. Use `as` when you know the actual type. The compiler uses that type to generate code. Write an explicit condition when your program needs a runtime type decision.

## Convert a value to NBT

`toNBT(value)` converts numbers, booleans, strings, NBT arrays, and data template objects to NBT values. Read [NBTRef](../02base/06references) to access game data directly.
