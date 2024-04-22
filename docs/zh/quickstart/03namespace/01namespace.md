---
lastUpdate: true
---

# 命名空间

MCFPP中的命名空间和MC中的命名空间是同一种东西。这也意味着，命名空间只能是小写字母、数字，点和下划线的组合。

你可以在文件中声明一个命名空间，这样文件中的所有函数和变量都会被放置在这个命名空间中。例如：

```mcfpp
namespace test;

func test(){    # test:test函数
    print(i);
}
```

一个文件中只能声明一次命名空间。

同样的，你也可以在项目配置文件中声明这个命名空间。

```json
{
    "file":[
        "*"
        "D:/workspace/mcfpp/project/*"
    ],
    "version":"1.19.4",
    "include":[
        "D:/workspace/mcfpp/another_project.json"
    ],
    "targetPath":"./out",
    //工程的默认命名空间。可选，默认为default // [!code focus]
    "namespace":"mcfpp" // [!code focus]
}
```
