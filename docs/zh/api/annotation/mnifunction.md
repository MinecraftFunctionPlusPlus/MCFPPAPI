---
lastUpdated: true
---

# MNIFunction

`top.mcfpp.annotations.MNIFunction` 描述普通 Java MNI 入口。首次编写入口时，按 [MNI 入门](/zh/quickstart/09mni/01mni-framework)完成工程和源码绑定。

## 包装入口签名

```text
public static void method(
    只读参数...,
    普通参数...,
    成员调用者,
    ValueWrapper<返回值类型> result
)
```

自由函数省略成员调用者。返回类型为 `void` 时省略结果包装。输入使用 `Var` 子类，例如 `MCInt`。有结果时通过 `result.set(value)` 提交返回值。

完整参数对应示例见 [MNI 参数与返回值](/zh/quickstart/09mni/02mni-framework-implementation)。

## 注解字段

| 字段 | 默认值 | 含义 |
| --- | --- | --- |
| `readOnlyParams` | `{}` | 按顺序声明只读参数类型 |
| `normalParams` | `{}` | 按顺序声明普通参数类型 |
| `caller` | `"void"` | 成员调用者的类型标记 |
| `returnType` | `"void"` | MCFPP 返回类型 |
| `override` | `false` | 标记继承方法重写 |
| `genericType` | `{}` | 泛型调用者所用的类型参数名 |
| `tag` | `{}` | 额外标记 |
| `identifier` | `""` | 注册名称，空值使用 Java 方法名 |
| `returnsConstWhenArgsConst` | `false` | 声明常量输入对应常量结果的属性 |

注解用于 Java 方法，并保留到 JVM 运行时供编译器读取。显式 MCFPP 声明负责源码接口和实际调用者类型，`caller` 提供类型标记。

## NativeCallContext 入口

另一种签名是 `public static void method(NativeCallContext context)`。参数、调用者、已知值和结果发布都通过这个上下文访问。标准库使用它连接编译器的读写操作。

属性入口采用该形式，见 [MNIAccessor](./mniaccessor) 和 [MNIMutator](./mnimutator)。
