---
lastUpdated: true
---

# 开始使用

MCFPP目前提供了两种使用方法：直接使用命令行，或者借助Gradle进行构建。如果只是使用简单的功能，推荐使用命令行。Gradle则提供了更多的功能支持，例如[MNI](../11mni/01mni-framework.md)。

## 使用命令行编译

你可以从Github的发布页下载到最新的MCFPP编译器版本，它应当是一个Jar文件。MCFPP的运行需要Java 21或更高版本。你可以将它放在任何地方，只要你能在命令行中找到它。

首先，你需要创建一个项目文件夹，同时创建一个工程配置文件。在下一节中，你可以找到有关工程配置文件的详细格式。在本例中，我们创建了一个`example.json`作为工程配置文件。

```json
{
  "description": "",
  "namespace": "mcfpp",
  "targetPath": "D:\\.minecraft\\saves\\MCFPP Example\\datapacks"
}
```

随后，我们创建一个简单的mcfpp文件，例如`example.mcfpp`：

```mcfpp
func hello {
    print("Hello World");
}
```

接下来，我们可以使用命令行编译这个项目：

```shell
java -jar mcfpp.jar example.json
```

这个命令会将`example.mcfpp`编译为一个数据包，并输出到`D:\.minecraft\saves\MCFPP Example\datapacks`目录下。随后，你可以进入游戏加载这个数据包，并运行`function mcfpp:hello`来查看效果。

## 使用Gradle构建

TODO
