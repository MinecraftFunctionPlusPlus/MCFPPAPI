---
lastUpdated: true
---

# 原生命令

MCFPP支持Minecraft原生命令的使用。有两种方法可以使用原生命令：

## 使用`/`插入命令

以`/`开头的语句将会被认为是一个原生命令。例如：

```mcfpp
func test {
    /summon minecraft:armor_stand ~ ~ ~
}
```

将会直接在`test`函数中插入一个summon命令。

## 使用`insert`函数

`insert`函数可以将一个字符串插入到当前位置。例如：

```mcfpp
func test {
    insert("summon minecraft:armor_stand ~ ~ ~");
}
```

将会将`insert`参数中的原文插入到test函数中。值得注意的是，`insert`函数的参数是一个字符串，因此你可以在其中插入任何内容，这同时意味着编译器不会对命令格式进行任何检查。

## 命令插值

参见[JVM访问符](../11mni/05access.md)
