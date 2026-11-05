---
lastUpdated: true
---

# MNIFunction

`top.mcfpp.annotations.MNIFunction` 描述原生 Kotlin/JVM MNI 入口。编译器在构建时调用它。

```kotlin
import top.mcfpp.annotations.MNIFunction
import top.mcfpp.core.lang.MCInt
import top.mcfpp.util.ValueWrapper

object Arithmetic {
    @JvmStatic
    @MNIFunction(normalParams = ["int", "int"], returnType = "int")
    fun add(left: MCInt, right: MCInt, result: ValueWrapper<MCInt>) {
        result.set(left.plus(right) as MCInt)
    }
}
```

输入使用 `Var` 子类。包装 ABI 顺序为只读参数、普通参数、可选接收者、非 void 返回包装。Kotlin 方法返回 Unit/JVM void，MCFPP 结果通过 `result.set(value)` 提交。

| 字段 | 默认值 | 含义 |
| --- | --- | --- |
| `readOnlyParams` | `[]` | 只读参数类型 |
| `normalParams` | `[]` | 普通参数类型 |
| `caller` | `"void"` | 接收者类型标记 |
| `returnType` | `"void"` | MCFPP 返回类型 |
| `override` | `false` | 继承重写 |
| `genericType` | `[]` | 泛型类型参数名 |
| `tag` | `[]` | 额外标记 |
| `identifier` | `""` | 注册名称，空值使用 JVM 方法名 |
| `returnsConstWhenArgsConst` | `false` | 常量输入对应常量结果的属性 |

注解保留到 JVM 运行时。入口必须公开且 static，Kotlin object/companion 方法用 `@JvmStatic`。显式 MCFPP 声明负责源码接口，默认参数不会自动转换。完整绑定见[原生参数与返回值](/zh/quickstart/09mni/02mni-framework-implementation)。

## NativeCallContext

另一种入口只接收 `NativeCallContext`，参数、接收者与结果发布由上下文提供，方法仍返回 Unit/JVM void。属性入口也采用此形式，见 [MNIAccessor](./mniaccessor)和 [MNIMutator](./mnimutator)。

结构化宏使用独立的 [MNIMacro](./mnimacro) 协议和 [Kotlin DSL](../kotlin-dsl)。
