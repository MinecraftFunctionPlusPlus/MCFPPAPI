---
lastUpdate: true
---

# Nested Data Templates

If a Data Template contains a variable of another Data Template type as a member, nested Data Templates can be achieved.

## Basic Usage

```mcfpp
data A {
    valueA as int;
}

data B {
    valueB as int;
    dataA as A;
}

func main(){
    // Create objects
    var b = B();
    var a = A();
    a.valueA = 5;
    b.valueB = 5;
    b.dataA = A();

    // Or directly assign values
    var qwq as B = {
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

## Anonymous Definition

In a Data Template, an anonymous Data Template can be defined as a member type:

```mcfpp
data B{
    var valueB as int;
    dataA as data{
        int valueA;
    };
}
