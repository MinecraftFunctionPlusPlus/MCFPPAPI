---
lastUpdate: true
---

# Type delegation

:::warning
This content has been translated by AI. We welcome native speakers to help improve the translation.
:::

A data template can delegate itself to another data type using a special definition.

Use the as keyword to declare a type delegation:

```mcfpp
data <TemplateName> as <Type> {
    # data template members
}
```

A delegated data template automatically gets a private field named `value` whose type is the delegated type. The template cannot declare additional fields. The template can be explicitly converted to the delegated type.

Example without delegation:

```mcfpp
data Test{
    value as int;
}

var test as Test = {
    "value": 1
};
```

Stored NBT: `test:{value:1}`

With delegation:

```mcfpp
data Test as int;

var test as Test = Test(1);
```

Stored NBT: `test:1`

So a delegated data template is NBT-equivalent to its delegated type.

A delegated template automatically gets a constructor that takes the delegated type. You cannot add fields, but you can define functions and access the delegated value as this.value:

```mcfpp
data Test as int {
    func getValue() -> int {
        return this.value;
    }
}

var test as Test = Test(1);
print(test.getValue()); // 1
```

Delegation only affects storage and representation; the delegated template is still a distinct type. Test and int are different types (no inheritance). Test does not inherit int’s members and by default inherits from any. A delegated data template cannot extend other data templates:

```mcfpp
data Test as int: Parent {   // Error: cannot infer, delegation prevents extending
    func getValue() -> int {
        return this.value;
    }
}

var test as Test = Test(1);
print(test.getValue()); // 1
print(test + 1);        // Error: Test does not inherit int, no + operator
print((test as int) + 1); // 2
```