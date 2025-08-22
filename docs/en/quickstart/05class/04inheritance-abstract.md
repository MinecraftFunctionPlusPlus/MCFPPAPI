---
lastUpdate: true
---

# Inheritance and abstraction

In MCFPP, class support supports Inheritance and abstraction. 

## Inheritance

Use keyword `:` can declare a class is inherited from another class. Use keyword `super`, subclasses can visit parent class’s attributes and methods. Use keyword `override` can rewrite parent class’s method.

```mcfpp
class Parent{
    protect a as int;
    func test(){
        print("Parent");
        print(a);
    }
}

class Child: Parent{
    b as int;
    override func test(){
        print("Child");
        print(super.a);
    }
}
```

## Abstraction

Use keyword `abstract` can define an abstract class or an abstract method. You can declare an abstract function in an abstract class, and the subclass must achieve the abstract function. Abstract functions have no method body, only have method abstraction.

```mcfpp
abstract class A{
    abstract func test();
}

class B: A{
    override func test(){
        print("Hello, World!");
    }
}
```
