---
lastUpdate: true
---

# 命名空间

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
