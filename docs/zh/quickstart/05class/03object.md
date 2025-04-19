---
lastUpdate: true
---

# 单例

## 定义

使用`object class`声明一个单例的实体模板对象。单例是一种特殊的实体模板，只有一个实例。在其他方面，单例和普通实体模板没有区别。

```mcfpp
object class Singleton {
    # 成员
    value as int = 0;

    # 方法
    func setValue(value as int) {
        this.value = value
    }
}

//使用
Singleton.setValue(10)
```

## 伴随对象

如果声明了一个和实体模板同名的单例，那么我们称这个单例为实体模板的伴随对象。

```mcfpp
class Person {

    id as int = 0;

    constructor() {
        this.id = Person.nextId();
    }
}

object class Person {
    
    private id as int = 0;
    
    func nextId -> int {
        id = id + 1;
        return id;
    }
}
```
