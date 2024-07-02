---
lastUpdate: true
---

# Define and implement 

In MCFPP, can use keyword `interface` to declare an interface, interface is an abstract data type, it defines a group of function’s declaration, but have not achieved it. Class can achieve one or many interfaces, and make sure that class have the function defined in the interface.

## Define of interface 

The grammar to define a interface is shown below:

```mcfpp
interface InterfaceName{
    func methodName(parameterList) -> returnType;
    func methodName(parameterList) -> returnType;
    ...
}
```

There’s only declaration in the function of the interface, no function body. A interface can have many functions, each function separate by `;`. Functions in interface must be abstract function, don’t need to use keyword `abstract` to declare.

## Achieve of interface 

Interface can’t be instancing, but can achieve by class.

Class can achieve one or many interfaces, the class that achieves interface must achieve all functions declared in the interface. The grammar of achieves a interface is shown below:

```mcfpp
class ClassName: Interface1, Interface2, ...{
    # Attributes and functions of class 
    ...
    override func methodName(parameterList) -> returnType{
        # Function body 
    }
}
```

## Inherit of interface 

Interface also can inherit from other interfaces. The grammar of inherit a interface is shown:

```mcfpp
interface Interface1{
    func method1() -> void;
}

interface Interface2: Interface1{
    func method2() -> void;
}
```

If a class achieve an interface that inherits from other interface, then the class must achieve all functions of the interface and its inherited interface.
