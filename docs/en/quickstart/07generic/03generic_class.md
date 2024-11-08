---
lastUpdate: true
---

# Generic Classes

Just like functions, classes can also have read-only parameter lists. Such classes are called generic classes. Additionally, the read-only parameter list grants generic classes some special properties.

## Declaring Generic Classes

When declaring a class, generic parameters are enclosed in `<>` after the class identifier.

```mcfpp
class ClassName<type T>{
    # Class attributes and methods
    ...
}
```

In the above example, `T` is a generic parameter. As with functions, you can use `T` inside the class to declare variables, making the type of those variables the generic parameter `T`.

```mcfpp
class ClassName<type T>{
    T value;
    
    public ClassName(T value){
        this.value = value;
    }
    
    func getValue() -> T{
        return this.value;
    }
}

func main(){
    ClassName<int> c = ClassName(5);    # Creating an instance of a generic class
    print(c.getValue()); # Outputs 5
}
```

Just like with generic functions, the compiler does not immediately compile a generic class. Instead, it waits until instantiation and compiles the generic class based on the provided generic parameters at that moment. Similarly, the generated data pack will only include the compiled version of the class, not the original generic template.

As seen in the example above, if you explicitly declare the generic type when instantiating the class, you don't need to pass the generic parameter again during instantiation.

## Overloading Generic Classes

Since generic classes contain generic parameters, they can also be overloaded. The compiler will treat classes with different generic parameters as distinct classes.

```mcfpp
class Test<int i>{
    func print(){
        print(this.i);
    }
}

class Test<int i, int j>{
    func print(){
        print(this.i + this.j);
    }
}

func main(){
    var test = Test<5>();
    var test2 = Test<5, 6>();
    test.print();
    test2.print();
}
```
