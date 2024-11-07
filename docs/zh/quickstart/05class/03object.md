---
lastUpdate: true
---

# 单例

## 定义

使用`object class`声明一个单例的实体模板对象。单例是一种特殊的实体模板，只有一个实例。在其他方面，单例和普通实体模板没有区别。

```mcfpp
object class Singleton {
    // 成员
    int value = 0;

    // 方法
    func setValue(int v) {
        value = v
    }
}

//使用
Singleton.setValue(10)
```

## 伴随对象

如果声明了一个和实体模板同名的单例，那么我们称这个单例为实体模板的伴随对象。

```mcfpp
class Person {

    int id = 0;

    constructor() {
        this.id = Person.nextId();
    }
}

object class Person {
    
    private int id = 0;
    
    int nextId() {
        id = id + 1;
        return id;
    }
}
```
