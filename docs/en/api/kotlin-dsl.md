---
lastUpdated: true
---

# Kotlin DSL API

The public package is `top.mcfpp.mni.api`; annotations are in `top.mcfpp.annotations`. Import extensions with `import top.mcfpp.mni.api.*`. The current API is `0.2.0-experimental`.

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

`MacroContext.quote` and `DeclarationContext.quote` return KotlinQuote. Use `quote.kotlin()` for a base Quote, or `builder.kotlin { ... }` for an existing CodeBuilder. All establish CodeScope and invoke the callback once during construction.

| API | Semantics |
| --- | --- |
| `block(body: CodeScope.() -> Unit): Block` | Construct a statement region |
| `expression(type: TypeRef<T>, body: CodeScope.() -> Unit): Expr<T>` | Construct a result region; each normal exit must yield |
| `literal(Int / Float / Boolean / String)` | Construct a typed literal |
| `local(initial)` / `local(hint, initial)` | Infer the type from the initializer and return `Local<T>` |
| `Value<T>.value: Expr<T>` | Stable bound input |
| `Ref<T>.value: Expr<T>` | Read a location; assignment constructs a write |
| `assign(ref, expr)` / `evaluate(expr)` / `append(block)` | Assign, evaluate as a statement, or hygienically import a block |
| `yield(expr)` | Supply the current expression or generated method result |

The `.value` DSL extensions are available inside CodeScope. Outside it, use `Value.expr()`, `Ref.load()`, and the base builder. `Local<T>` is also `Ref<T>`. A Kotlin val fixes the host handle while its generated local remains writable.

## Expressions and operators

| Expression | Result |
| --- | --- |
| `a + b`, `a - b`, `a * b`, `a / b`, `a % b`, `-a` | `Expr<T>` |
| `a lt b`, `a le b`, `a gt b`, `a ge b` | `Expr<BoolT>` |
| `a eq b`, `a ne b` | `Expr<BoolT>` |
| `!condition`, `a and b`, `a or b` | `Expr<BoolT>` |
| `ref += expr`, `ref -= expr` | Construct a location update |

Operations validate actual MCFPP types: numeric arithmetic uses matching int/float operands, strings support addition, and logical operations require bool. Right-hand host literals support Int and Float arithmetic and String addition. `Ref<IntT>` +=/-= also accepts Int.

Kotlin `==`, `<`, `&&`, and `||` have host-language semantics. Use `eq`, `lt`, `and`, and `or` to construct code. Wrap comparison literals, for example `count.value lt literal(5)`.

## Control flow and calls

```kotlin
ifThen(condition) { /* generated statements */ }
ifElse(condition, { /* then */ }, { /* else */ })
whileLoop({ count.value lt limit.value }) {
    count += 1
}
```

Kotlin if/for execute during construction; these DSL methods build runtime control flow. The whileLoop condition constructor runs once, while its generated condition is evaluated before every runtime iteration.

| Call | Behavior |
| --- | --- |
| `call(function, vararg expressions): Expr<R>` | Construct a result call |
| `callVoid(function, vararg expressions)` | Append a void call |
| `inline<R>(callback, vararg expressions): Expr<R>` | Insert a source callback with a result |
| `inlineVoid(callback, vararg expressions)` | Insert a void callback |

Varargs pass every expression by VALUE. Explicit lists use `CallArgument.value/ref/constant/inline` and `InlineArgument.value/ref/constant`. Expressions returned by call and inline execute only where used; use evaluate for a standalone statement.

## Minecraft contexts

```kotlin
context.quote.block {
    executeAs(entities(EntityQuery.allPlayers())) { self ->
        at(position(self)) {
            score(self, "hp") += 1
        }
    }
}
```

CodeScope directly provides MinecraftBuilder methods. executeAs changes the executor, at changes position, and rotated changes rotation. Each callback enters its corresponding child scope.

| API | Result or purpose |
| --- | --- |
| `entities(query)` | `EntitySet` |
| `score(entity, objective)` / `score(holder, objective)` | `Ref<IntT>` |
| `position(x, y, z)` / `position(entity)` / `currentPosition()` | `PositionHandle` |
| `rotation(yaw, pitch)` / `rotation(entity)` / `currentRotation()` | `RotationHandle` |
| `offset(base, x, y, z)` / `localOffset(base, rotation, left, up, forward)` | `PositionHandle` |
| `blockAt(position)` / `blockMatches(block, predicate)` | `BlockHandle` / `Expr<BoolT>` |

## Services, types, and addresses

| Service | Purpose |
| --- | --- |
| `types().intType/boolType/floatType/stringType/voidType()` | Primitive type descriptors |
| `types().lookup(name)` | Look up an accessible canonical type |
| `types().function(name, argumentTypes)` | Select an accessible overload by actual argument types |
| `diagnostics().warning/error(site, message)` | Report source diagnostics |
| `helpers().define(hint, signature, body)` | Construct a helper with its own parameters |
| `resources().reserve(kind, hint, data)` | Stage a resource and commit it on success |

The compiler creates TypeRef, FieldRef, FunctionRef, and code nodes. Host generic markers do not replace actual type and scope validation.

`Ref<IntT>` is an integer location. `Value<ScoreRefT>` and `Value<NBTRefT<IntT>>` carry ordinary VALUE address descriptors. Their .value reads the descriptor; source tryRead/set operations access the target. See [macro parameters](/en/quickstart/mni-macros/parameters) for forwarding and callbacks.

Macro and declaration callbacks are consumed immediately during construction. The tree retains structured nodes, and expansion/scope rules constrain builders, locals, and context handles. Generated methods can use the same DSL through method.builder().kotlin { ... }.
