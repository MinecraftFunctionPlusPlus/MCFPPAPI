---
lastUpdate: true
---

# Miscellaneous

## Base Entity

In the example at the beginning of this chapter, you may have noticed the line `@Base<"creeper">`. This line of code is called an **annotation**, which we will discuss in later chapters. Using the `@Base<"creeper">` annotation on the line before the class definition specifies which entity this entity template is based on. This entity is the base entity.

Generally, most entities cannot store custom data well directly, so when the base entity is not `item_display` or `marker`, a `marker` entity will ride on this entity to store the custom fields of the entity template.

The base entity has the tag `<namespace>_class_<classname>_pointer`, while the entity used to store data has the tag `<namespace>_class_<classname>_pointer_data`.

::: info
After 24w10a, all entities can store custom data through the `minecraft:custom_data` entity component. This means that in future versions of mcfpp, classes composed of any type of base entity will store data uniformly in the `minecraft:custom_data` component.
:::

## Lifecycle of Entity Templates

The lifecycle of an entity template is consistent with that of the base entity. When the base entity is removed, the entity template is also removed. This process is automatically handled by the garbage collector (GC).

Of course, you can manually release memory using the `dispose` function <Badge type="tip">Future Feature</Badge>:

```mcfpp

var p = SuperCreeper("Super Creeper");

p.dispose();

```
