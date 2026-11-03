---
lastUpdated: true
---

# MNIMacro

`top.mcfpp.annotations.MNIMacro` 描述生成代码的 Java 宏入口。完整开发过程见 [MNI 宏教程](/zh/quickstart/mni-macros/overview)。

## 入口签名

```text
public static Expr<R> method(MacroContext context, 宏输入...)
public static Block method(MacroContext context, 宏输入...)
```

`Expr<R>` 用于有结果的代码，`Block` 用于无结果代码。首个 Java 参数为 `MacroContext`，之后的参数与 `params` 顺序一致。

`R` 使用宏 API 类型标记，例如整数标记 `IntT`。输入通过 `Value<T>` 等接口接收。

## MNIMacro 字段

| 字段 | 默认值 | 含义 |
| --- | --- | --- |
| `identifier` | `""` | 源码函数名称，空值使用 Java 方法名 |
| `params` | `{}` | 按顺序列出 `MacroParam` |
| `returnType` | `"void"` | 源码返回类型 |

## MacroParam 字段

| 字段 | 默认值 | 含义 |
| --- | --- | --- |
| `name` | 必填 | 源码参数名称 |
| `type` | 必填 | MCFPP 类型，例如 `"int"`、`"(int)->void"` |
| `mode` | `VALUE` | 输入模式 |

`VALUE`、`CONST`、`REF` 和 `INLINE` 的含义与完整代码见[参数和表达式](/zh/quickstart/mni-macros/parameters)。宏注解的命名信息在宏库加载时参与登记，加载流程见[教程入口](/zh/quickstart/mni-macros/overview#让宏具有可调用的名字)。
