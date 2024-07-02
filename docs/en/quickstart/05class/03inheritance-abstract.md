---
lastUpdate: true
---

# Inheritance and abstraction

In MCFPP, class support supports Inheritance and abstraction. Inheritance means a class can derive one or many subclasses, subclasses can inherit parent class’s attributes and methods. Abstraction means a class can define abstract function, subclasses must achieve those abstract functions.

## Inheritance 

Inheritance means a class can derive one or many subclasses, subclasses can inherit parent class’s attributes and methods. The grammar of inheritance is shown below:

```mcfpp
class Parent{
    protect int a;
    func test(){
        print("Parent");
        print(a);
    }
}

class Child: Parent{
    int b;
    override func test(){
        print("Child");
        print(super.a);
    }
}
```

Use keyword `:` can declare a class is inherited from another class. Use keyword `super`, subclasses can visit parent class’s attributes and methods. Keyword `protected` can declare the protected attributes, subclasses can visit the protected attributes of parent class. Use keyword `override` can rewrite parent class’s method.

## Abstraction 

A class can define abstract methods, subclasses must achieve those abstract methods. Abstract methods have no method body,only have method abstraction. The grammar to define a abstract method is shown below:

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

Use keyword `abstract`can define an abstract class or an abstract method. The subclass of abstract class must achieve the abstract method, else there’ll be compilation error.
