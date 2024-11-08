---
lastUpdate: true
---

# Entity Template

In MCF, most of the operations are based on entities. The most frequently used command may be the `execute as` command. In MCFPP, the concept of Entity Template is introduced to manage a class of entities and declare fields and methods for this class of entities to store and operate data. In the past design, Entity Template was also called Class.

```mcfpp
@Base<"creeper">
class SuperCreeper{

    text name;

    constructor(text name){
        this.name = name;
    }

    override func tick(){
        effect(@a[distance=..5], Effects.Poison);
        title(@a[distance=..5], this.name);
    }

}
```

## Define of entity template

Entity Template was once called Class, so in the design, its syntax is very similar to the declaration syntax of class in Java/C#. So, if you have the basic knowledge, you should be able to get started easily.

In MCFPP, you can use keyword `class` to define a entity template:

```mcfpp
class ClassName{
    # Class body
    #...
}
```

In it, `ClassName` is the name of the entity template. In MCFPP, the name of a entity template must start with an upper letter. The big parentheses followed that is the class body, including the member variable and member function, also the constructor and so on.

## Instantiate of class

Often, you can use `ClassName(<parameter list>)` to create a instantiation of an object. Such as the example `SuperCreeper` class in the start of this article, you can create by `SuperCreeper p = SuperCreeper("Super Creeper")`.

## Initializer

When you create a entity template, you can use object Initializer to Instantiate some members of the class, such as the person shows before `SuperCreeper`, you have:

```mcfpp
SuperCreeper p = SuperCreeper("")[
    name = "Super Creeper"
];
```

::: tip

### Not just for entity template initialization

In fact, entity template initializer can be used anywhere, not just when initializing entity templates. For example

```mcfpp
func main(){
    Test t = Test();
    t = t[a = 100];
    print(t.toText());
}
```

In this example, the `t` object is initialized with `Test()`, and then the `a` field of `t` is set to `100` using the entity template initializer.
:::

::: tip

### Entity Template and Class

Class is a special form of entity template. Sometimes, you may just want to store some data, rather than perform some operations on a class of entities. In this case, we prefer to call the entity template a class. Therefore, in the subsequent documents, if you see the word "class", you can think of it as a synonym for "entity template".
:::
