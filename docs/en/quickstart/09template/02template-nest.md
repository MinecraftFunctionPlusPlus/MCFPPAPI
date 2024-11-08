---
lastUpdate: true
---

# Nested Data Templates

If a Data Template contains a variable of another Data Template type as a member, nested Data Templates can be achieved.

## Basic Usage

```mcfpp
data A {
    int valueA;
}

data B {
    int valueB;
    A dataA;
}

func main(){
    // Create objects
    B b = B();
    A a = A();
    a.valueA = 5;
    b.valueB = 5;
    b.dataA = A();

    // Or directly assign values
    B qwq = {
        "valueB": 5,
        "dataA": {
            "valueA": 5
        }
    };

    // Access values
    print(b.valueB);
    print(b.dataA.valueA);
}
```

Apparently, using the same type as a member within a Data Template is not allowed.
