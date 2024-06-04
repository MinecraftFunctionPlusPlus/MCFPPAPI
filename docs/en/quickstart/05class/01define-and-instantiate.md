---
lastUpdate: true
---

# The instantiate and define of class

```mcfpp
class Person{
    string name;
    int age;
    string sex;
    
    constructor(string name, int age){
        this.name = name;
        this.age = age;
    }

    func setName(string name){
        this.name = name;
    }

    func toString() -> string{
        return "Name: " + this.name + ", Age: " + this.age;
    }
}
```


## Define of class

As a OOP(object oriented programming) language, MCFPP have complete OOP grammar and function. Its grammar is really similar with Java/C#. So, if you have the basic knowledge, you can learn it very easily.

In MCFPP, you can use keyword `class` to define a class:

```mcfpp
class ClassName{
    # Class body
    #...
}
```

In it, `ClassName` is the name of the class. In MCFPP, the name of a class must start with an upper letter. The big parentheses followed that is the class body, including the member variable and member function, also the constructor and so on. Yes, the same as Java/C#.

## Instantiate of class 

Often, you can use `ClassName(parameter list )` to create a instantiation of an object. Such as the example `Person` class in the start of this article, you can create by `Person p = Person("Alumopper",16)`. In MCFPP, you don’t need keyword `new`. It’s ignored.

## Object Initializer <Badge type="tip" text="Future feature" />

When you create a class, you can use object Initializer to Instantiate some members of the class, such as the person shows before `Person`, you have:

```mcfpp
Person p = Person("Alumopper",16){
    sex = "F"
};
```

So the`sex` of member variable `p` will be instantiate as `"F"`.
