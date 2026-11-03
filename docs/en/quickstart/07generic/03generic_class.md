---
lastUpdated: true
---

# Generic data templates: store different types

[Generic functions](./02generic_function) use a type parameter for a function call. Generic data templates use it for objects. Fields, constructors, and methods can all use the selected type.

This page uses `Box<T>` to store one value. `Box<int>` stores an integer. `Box<string>` stores a string.

## Complete example

```mcfpp
data Box<T> {
    var value: T

    constructor(value: T) {
        this.value = value
    }

    func read(): T {
        return this.value
    }
}

func showScore(box: Box<int>) {
    print(box.read())
}

func main() {
    var score = Box<int>(10)
    var label = Box<string>("Ready")
    showScore(score)
    print(label.read())
}
```

Running `main` displays `10` and `Ready`.

## Where the type parameter applies

| Example location | In `Box<int>` | In `Box<string>` |
| --- | --- | --- |
| Field `value: T` | `int` | `string` |
| Constructor parameter `value: T` | `int` | `string` |
| Result of `read(): T` | `int` | `string` |

In `Box<int>(10)`, `<int>` selects the template type. `(10)` invokes its constructor. That selection determines `T` for the new object.

`this.value = value` stores the constructor argument in the object's field. `read()` returns that field with the same type.

## Declare a generic parameter type

`showScore(box: Box<int>)` requires a `Box` that stores an integer. The function therefore knows that `box.read()` returns an `int`.

To accept several `Box` types, give the function its own type parameter:

```mcfpp
func readBox<T>(box: Box<T>): T {
    return box.read()
}
```

Place this function after the `Box<T>` declaration above. Call `readBox<int>(score)` inside `main` to obtain its stored integer. Each `T` belongs to its own declaration.

## Each object stores its own value

`Box<int>(10)` and `Box<int>(20)` use the same type. They remain separate objects with their own fields. Matching type arguments let the compiler reuse a template implementation. Each constructor call creates separate object data.

Read [Compilation parameters and known values](./01concrete_var) for fixed numeric configuration. Read [in and out](../advanced/variance) for generic relationships between parent and child types.
