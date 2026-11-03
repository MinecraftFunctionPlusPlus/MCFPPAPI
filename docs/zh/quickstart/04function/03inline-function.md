---
lastUpdated: true
---

# 内联函数

在 `func` 前写 `inline`，让编译器在调用位置编译函数正文。

```mcfpp
inline func announceReady() {
    /say Ready
}

func main() {
    announceReady()
}
```

当前版本的内联示例采用 `void` 命令辅助函数。带返回值的计算使用普通 `func`，例如[整数加法](./01define-and-call)。

内联可能在多个调用点生成多份命令。使用 [Dump IR](../01project/04build-and-ir) 比较输出，再决定哪些函数需要内联。

需要把逻辑作为参数传入时，使用[函数值与 lambda](./05lambda)。
