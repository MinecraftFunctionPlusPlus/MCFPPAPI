---
lastUpdate: true
---

# Member of class 

Similar to Java, in MCFPP, members of class include attributes and methods. Attributes are the data members, used to store the data of the object; methods are the function of class member, used to operate the data of the object. Member of class can access by `.` operator.

## Attributes 

Attributes are the data member of class, used to store the data of a object. The grammar to define attributes is shown below:

```mcfpp
class A{
    int a;
    int b = 5;
}
```

The code before defined a class `A`, it has two attributes `a` and `b`. `a` is a integer attribute, not initialized; `b` is a integer attribute, initialized as `5`.

## Method 

Methods are the function member of class, used to operate the data of the object. The grammar to define a method is shown below:

```mcfpp
class A{
    void test(){
        print("Hello, World!");
    }
}
```

Use keyword `this` can access the attributes of the object,such as:

```mcfpp
class A{
    int a;
    void setA(int a){
        this.a = a;
    }
}
```

## Access control 

In MCFPP, members of class can use keywords `public`, `protected` and `private` to control the access rights. Default, members of class are `private`.

- `public`：public, accessible to outside.
- `protected`：protected, accessible to subclasses.
- `private`：private, only can access in the class.

```mcfpp
class A{
    public int a;
    protected int b;
    private int c;
}

class B: A{
    void test(){
        a = 1;  # Allowed 
        b = 2;  # Allowed 
        c = 3;  # Error 
    }
}

func test(){
    A obj = new A();
    obj.a = 1;  # Allowed 
    obj.b = 2;  # Error 
    obj.c = 3;  # Error 
}
```
