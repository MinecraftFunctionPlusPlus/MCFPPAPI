---
lastUpdate: true
---

# 泛型类

和函数一样，类也可以拥有只读参数列表。这样子的类被成为泛型类。同时，只读参数列表还给泛型类带来了一些特殊的性质。

## 泛型类的声明

泛型参数在声明类的时候，在类的标识符后面，使用`<>`包裹泛型参数。

```mcfpp
class ClassName<type T>{
    #类的属性和方法
    ...
}
```

在上面的例子中，`T`是泛型参数。和函数一样，在类的内部，可以使用`T`来声明变量，这样，这个变量的类型就是泛型参数`T`。

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
    ClassName<int> c = ClassName(5);    //创建泛型类的对象
    print(c.getValue()); //输出5
}
```

和泛型函数一样，在编译过程中，并不会立刻编译泛型类，而是会在实例化的过程中，根据传入的泛型参数，即时编译这个泛型类。同样的，在生成的数据包中也只会包含编译生成的类，不会包含泛型的原始类型。

从上面的例子中也可以注意到，在实例化泛型类的过程中，如果显示声明了泛型类型，那么在实例化的时候，就不需要再传入泛型参数了。

## 泛型类的重载

由于泛型类含有泛型参数，那么当然也能进行重载。根据泛型参数的不同，编译器会将其视作不同的类。

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
