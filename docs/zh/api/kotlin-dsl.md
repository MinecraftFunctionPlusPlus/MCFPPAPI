---
lastUpdated: true
---

# Kotlin DSL API

公开包为 `top.mcfpp.mni.api`，注解位于 `top.mcfpp.annotations`。使用 `import top.mcfpp.mni.api.*` 导入扩展。当前 API 为 `0.2.0-experimental`。

## Quote / CodeScope

```kotlin
context.quote.block {
    val total = local("total", literal(0))
    total += 1
}

context.quote.expression(context.types().intType()) {
    yield(literal(42))
}
```

`MacroContext.quote` 和 `DeclarationContext.quote` 返回 KotlinQuote；底层 Quote 可以使用 `quote.kotlin()`。已有 CodeBuilder 使用 `builder.kotlin { ... }`。这些入口都建立 CodeScope，回调在构造时立即执行一次。

| 接口 | 语义 |
| --- | --- |
| `block(body: CodeScope.() -> Unit): Block` | 构造语句区域 |
| `expression(type: TypeRef<T>, body: CodeScope.() -> Unit): Expr<T>` | 构造有结果区域，每条正常出口必须 yield |
| `literal(Int / Float / Boolean / String)` | 构造对应字面量 |
| `local(initial)` / `local(hint, initial)` | 从初值推导类型，返回 `Local<T>` |
| `Value<T>.value: Expr<T>` | 稳定的已绑定输入 |
| `Ref<T>.value: Expr<T>` | 读取位置；赋值生成写入 |
| `assign(ref, expr)` / `evaluate(expr)` / `append(block)` | 赋值、表达式语句、卫生导入代码块 |
| `yield(expr)` | 提供当前表达式或生成方法的结果 |

`.value` 的 DSL 扩展在 CodeScope 内可用。作用域外可用 `Value.expr()`、`Ref.load()` 和底层 builder；`Local<T>` 也是 `Ref<T>`。Kotlin val 固定的是宿主句柄，生成的局部变量仍可写。

## 表达式与运算

| 写法 | 结果 |
| --- | --- |
| `a + b`, `a - b`, `a * b`, `a / b`, `a % b`, `-a` | `Expr<T>` |
| `a lt b`, `a le b`, `a gt b`, `a ge b` | `Expr<BoolT>` |
| `a eq b`, `a ne b` | `Expr<BoolT>` |
| `!condition`, `a and b`, `a or b` | `Expr<BoolT>` |
| `ref += expr`, `ref -= expr` | 生成位置更新 |

运算按实际 MCFPP 类型校验：算术接受匹配的 int/float，字符串支持加法，逻辑运算要求 bool。右侧宿主字面量重载支持 Int 数值运算、Float 数值运算和 String 加法；`Ref<IntT>` 的 +=/-= 支持 Int。

Kotlin 的 `==`、`<`、`&&`、`||` 具有宿主语言语义。构造代码时使用 `eq`、`lt`、`and`、`or`；比较数值先用 `literal(...)` 包装，例如 `count.value lt literal(5)`。

## 控制流与调用

```kotlin
ifThen(condition) { /* generated statements */ }
ifElse(condition, { /* then */ }, { /* else */ })
whileLoop({ count.value lt limit.value }) {
    count += 1
}
```

Kotlin 的 if/for 在生成期执行；这些 DSL 方法建立运行时控制流。whileLoop 的条件构造回调只执行一次，生成的条件在运行期每轮重新求值。

| 调用 | 行为 |
| --- | --- |
| `call(function, vararg expressions): Expr<R>` | 构造有结果调用 |
| `callVoid(function, vararg expressions)` | 追加无结果调用 |
| `inline<R>(callback, vararg expressions): Expr<R>` | 插入有结果源码回调 |
| `inlineVoid(callback, vararg expressions)` | 插入 void 回调 |

变参形式将每项作为 VALUE。显式模式列表使用 `CallArgument.value/ref/constant/inline` 和 `InlineArgument.value/ref/constant`。`call` 与 `inline` 产生的表达式只在使用点执行，独立语句调用 `evaluate`。

## Minecraft 上下文

```kotlin
context.quote.block {
    executeAs(entities(EntityQuery.allPlayers())) { self ->
        at(position(self)) {
            score(self, "hp") += 1
        }
    }
}
```

CodeScope 直接提供 MinecraftBuilder 方法。executeAs 改变执行者，at 改变位置，rotated 改变旋转；回调进入对应子作用域。

| API | 结果或作用 |
| --- | --- |
| `entities(query)` | `EntitySet` |
| `score(entity, objective)` / `score(holder, objective)` | `Ref<IntT>` |
| `position(x, y, z)` / `position(entity)` / `currentPosition()` | `PositionHandle` |
| `rotation(yaw, pitch)` / `rotation(entity)` / `currentRotation()` | `RotationHandle` |
| `offset(base, x, y, z)` / `localOffset(base, rotation, left, up, forward)` | `PositionHandle` |
| `blockAt(position)` / `blockMatches(block, predicate)` | `BlockHandle` / `Expr<BoolT>` |

## 服务、类型与地址

| 服务 | 用途 |
| --- | --- |
| `types().intType/boolType/floatType/stringType/voidType()` | 基本类型描述 |
| `types().lookup(name)` | 查询当前可访问的规范类型 |
| `types().function(name, argumentTypes)` | 按实际实参类型选择可访问重载 |
| `diagnostics().warning/error(site, message)` | 报告调用处问题 |
| `helpers().define(hint, signature, body)` | 构造具有独立参数的 helper |
| `resources().reserve(kind, hint, data)` | 暂存资源，成功后提交 |

`TypeRef`、`FieldRef`、`FunctionRef` 和代码节点由编译器创建；宿主泛型标记不能替代实际类型与作用域校验。

`Ref<IntT>` 是整数位置；`Value<ScoreRefT>` 和 `Value<NBTRefT<IntT>>` 是普通 VALUE 地址描述。后两者的 `.value` 读取描述，目标数据通过源码 `tryRead`/`set` 操作。完整转发与回调示例见 [宏参数](/zh/quickstart/mni-macros/parameters)。

宏和声明生成回调在构造时被立即消费。代码树保留结构化节点，builder、局部变量和上下文句柄的生命周期受展开与作用域约束。声明方法可以通过 `method.builder().kotlin { ... }` 使用同一 DSL。
