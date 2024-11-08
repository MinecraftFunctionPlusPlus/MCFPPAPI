---
lastUpdate: true
---

# Singleton

## Definition

Use `object class` to declare a singleton class object. A singleton is a special type of class that only has one instance. In other aspects, a singleton has no different from a regular class.

```mcfpp
object class Singleton {
    # Member
    int value = 0;

    # Method
    func setValue(int v) {
        value = v
    }
}

# Usage
Singleton.setValue(10)
```

## Companion Object

If a singleton is declared with the same name as a class, we define this singleton as the class's companion object.

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
