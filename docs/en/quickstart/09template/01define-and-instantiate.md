---
lastUpdate: true
---

# Data Template

A Data Template is a data structure similar to a class. It is entirely based on the NBT data structure, but unlike ordinary NBT, a Data Template defines the structure of the NBT. In other words, it specifies which members exist in the NBT, allowing the compiler to check member access during compilation.

## Definition

Use the `data` keyword to define a Data Template. For example:

```mcfpp
# Definition
data Test{
    int a;  # An integer
    nbt b;  # Any NBT value
}

func main(){
    # Create an object
    Test t = Test();
    t.a = 5;
    t.b = {
        "key": "value"
    };

    # Or directly assign values
    Test t2 = {
        "a": 5,
        "b": {
            "key": "value"
        }
    };
}
```

Members of a Data Template can be accessed using the `.` operator.

```mcfpp
print(t.a);
print(t.b);
```

Like a class, you can also define methods within a Data Template.

```mcfpp
data Test{
    int a;
    nbt b;

    func print(){
        print(this.a);
        print(this.b);
    }
}
```
