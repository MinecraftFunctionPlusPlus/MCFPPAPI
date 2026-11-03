---
lastUpdated: true
---

# MNI API 参考

本节说明 Java 扩展使用的入口和命令对象。完整工程从 [MNI 入门](/zh/quickstart/09mni/01mni-framework)开始。

| 接口 | 用途 |
| --- | --- |
| [MNIFunction](./annotation/mnifunction) | 普通原生函数与结果 |
| [MNIMacro](./annotation/mnimacro) | 生成类型化代码的宏 |
| [MNIAccessor](./annotation/mniaccessor) | 原生属性读取 |
| [MNIMutator](./annotation/mnimutator) | 原生属性写入 |
| [MNIMember](./annotation/mnimember) | 成员元数据标记 |
| [InsertCommand](./annotation/insertcommand) | 命令生成标记 |
| [Command](./class/command) | 组合 Minecraft 命令片段 |

普通 MNI 函数可以使用 `Var` 子类接收参数，通过 `ValueWrapper` 返回结果。另一种形式是接收单个 `NativeCallContext`，标准库用它处理接收者、参数和后端操作。

宏使用 `MacroContext`、`Value<T>`、`Expr<T>` 和 `Block` 描述要生成的代码。它与普通原生函数的接口分别对应不同的扩展需求。
