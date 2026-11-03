---
lastUpdated: true
---

# 顶层语句与初始化

顶层语句写在函数和模板声明之前。编译器将它们放入加载函数，并添加到 `minecraft:load` 标签中。

```mcfpp
var message = "Datapack loaded"
print(message)

func main() {
    print(message)
}
```

加载数据包或执行 `/reload` 时，顶层的 `print(message)` 输出一次消息。之后执行 `main`，可以再次读取同文件的顶层变量。

文件的顺序为：命名空间、导入、类型别名、顶层语句、函数和模板声明。顶层语句可以调用本文件中后面声明的函数。

使用顶层语句初始化自己的计分项：

```mcfpp
/scoreboard objectives add rewards dummy

func main() {
    /scoreboard players add @s rewards 1
}
```

命名函数通过显式调用运行。使用[函数标签资源](../01project/04build-and-ir)安排每 tick 工作时，将对应函数加入 `minecraft:tick` 标签。
