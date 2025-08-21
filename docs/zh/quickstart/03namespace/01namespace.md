---
lastUpdate: true
---

# 命名空间

## 定义

MCFPP中的命名空间和MC中的命名空间是同一种东西。这也意味着，命名空间只能是小写字母、数字，点和下划线的组合。

你可以在文件中声明一个命名空间，这样文件中的所有函数和变量都会被放置在这个命名空间中。例如：

```mcfpp
namespace test;

func test {    # test:test函数
    print(i);
}
```

一个文件中只能声明一次命名空间。

若没有声明命名空间，文件的命名空间将会由文件路径相对于源代码路径的相对路径决定。例如，假设源代码目录为`src/main/mcfpp`，项目命名空间为`test`，那么文件`src/main/mcfpp/uwu/test.mcfpp`的命名空间将会是`test:uwu`。源代码路径通过工程配置文件中的`sourcePath`决定。

## 编译时命令<Badge type="tip">技术性内容</Badge>

在命名空间下声明一个没有名字的`mcfpp`文件，即`.mcfpp`文件，编译器将会把此文件判定为包含了编译时命令的文件。

编译时命令将会在`INDEX_TYPE`编译阶段后，`stageProcessor[INDEX_TYPE]`处理器执行前执行。编译时命令定义为`#>`开头的一行行注释，其后的内容就是命令内容。目前支持的命令有：

### `injectedBy <classPath>`

向当前命名空间中注入一个MNI类定义的函数作为命名空间内的全局函数。

* `classPath`一个MNI类的完全Java类限定名。

例如

```mcfpp
#> injectedBy top.mcfpp.mni.minecraft.StdCommands
```
