---
lastUpdated: true
---

# 类型视图

`data Name as Type` 为已有存储类型定义一个视图：

```mcfpp
data Score as int

func main() {
    var score: Score = 10 as Score
    print((score as int) + 5)
}
```

`Score` 使用整数布局。`score as int` 以原类型读取当前值。`as` 改变编译器看待数据的类型，实际数据保留原存储布局。

类型视图适合给已有布局提供名称。单纯为已有类型增加别名时，使用 `typealias int as Score`。

当前开发版调用视图实例方法会触发编译器类型转换错误。需要字段和方法的数据模型使用普通 `data`，示例见[数据模板](./01define)。
