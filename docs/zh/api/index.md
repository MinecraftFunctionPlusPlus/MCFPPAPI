---
lastUpdated: true
---

# MNI API 参考

MNI API、DSL 和工程模板以 Kotlin 为主要设计对象。Java 保留调用生成的 JVM 方法的能力。默认工程入口见 [Kotlin MNI 工程](/zh/quickstart/09mni/01mni-framework)。

| API | 用途 |
| --- | --- |
| [Kotlin DSL](./kotlin-dsl) | quote、表达式、位置写入、控制流、调用和上下文 |
| [MNIMacro](./annotation/mnimacro) | 结构化宏入口与参数模式 |
| [MNIFunction](./annotation/mnifunction) | 原生入口、编译器值与返回包装 |
| [MNIAccessor](./annotation/mniaccessor) / [MNIMutator](./annotation/mnimutator) | 原生属性读写 |
| [MNIMember](./annotation/mnimember) | 成员元数据 |
| [InsertCommand](./annotation/insertcommand) / [Command](./class/command) | 原生命令构造接口 |

结构化宏使用 `top.mcfpp.mni.api`，通过 `MacroContext`、`Value<T>`、`Expr<T>` 和 `Block` 构造代码。原生 `@MNIFunction` 使用 `Var` 子类、`ValueWrapper` 或 `NativeCallContext`；两种入口各自校验签名。

当前宏 API 版本为 `ApiVersion.VERSION = "0.2.0-experimental"`，与编译器发行版本独立。provider 可以通过 `ApiVersion.isCompatibleWith("0.2")` 自检。

完整示例见 [宏教程](/zh/quickstart/mni-macros/overview)，公开地址值见 [宏参数](/zh/quickstart/mni-macros/parameters)。
