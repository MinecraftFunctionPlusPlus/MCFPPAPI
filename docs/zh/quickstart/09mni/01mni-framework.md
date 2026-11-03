---
lastUpdated: true
---

# MNI 入门：从 Java 方法到数据包函数

MNI 是连接 MCFPP 与 Java 的接口。构建工程时，编译器调用 Java 方法，让它提供一个值或添加 Minecraft 命令。生成的数据包随后由 Minecraft 执行。

这一节完成最小流程：创建工程 → 编写 Java 方法 → 在 MCFPP 中声明并调用 → 构建和测试。示例让 `answer()` 返回 `42`。

## 1. 创建工程

准备 JDK 21。在 IDEA 中选择 **MCFPP MNI**，或运行：

```sh
mcfpp init hello-mni --mni
cd hello-mni
```

CLI 会创建这些主要文件：

```text
hello-mni/
├─ mcfpp.toml
├─ src/main/mcfpp/main.mcfpp
├─ src/main/java/example/mni/Example.java
└─ src/test/java/example/mni/ExampleTest.java
```

`main.mcfpp` 是调用方，`Example.java` 是 Java 实现，`ExampleTest.java` 检查 Java 计算。CLI 在构建时准备 Gradle 和依赖，首次准备需要联网。

## 2. 查看 Java 实现

`src/main/java/example/mni/Example.java`：

```java
package example.mni;

import top.mcfpp.annotations.MNIFunction;
import top.mcfpp.core.lang.MCInt;
import top.mcfpp.util.ValueWrapper;

public final class Example {
    public static int answerValue() {
        return 42;
    }

    @MNIFunction(returnType = "int")
    public static void answer(ValueWrapper<MCInt> result) {
        result.set(new MCInt(answerValue(), "answer"));
    }
}
```

这两个方法分工如下：

| 方法或类型 | 本例中的用途 |
| --- | --- |
| `answerValue()` | 用普通 Java 计算整数 `42` |
| `@MNIFunction` | 标记 MCFPP 可以绑定的 Java 入口 |
| `MCInt` | 用编译器理解的整数类型包装结果 |
| `ValueWrapper<MCInt> result` | 把整数结果交给 MCFPP 调用者 |

入口方法使用 `public static void`。Java 的 `void` 表示这个 Java 方法通过 `result.set(...)` 提交结果。对 MCFPP 调用方来说，`answer()` 的返回类型仍是 `int`。

## 3. 在 MCFPP 中声明并调用

`src/main/mcfpp/main.mcfpp`：

```mcfpp
func answer(): int = example.mni.Example.answer

func main() {
    print(answer())
}
```

声明左侧是 MCFPP 接口：名字为 `answer`，没有输入参数，返回 `int`。等号右侧是 Java 目标：包 `example.mni`、类 `Example`、方法 `answer`。

两端通过这条声明关联起来。之后就可以像普通函数一样调用 `answer()`。

## 4. 构建并在游戏中运行

```sh
mcfpp build
```

构建时，CLI 编译 Java 文件，编译器在 `answer()` 调用处执行 Java 入口，然后生成数据包。输出目录为 `build/hello-mni/`。

把这个目录复制到存档的 `datapacks/` 下。在游戏中运行：

```mcfunction
reload
function hello-mni:main
```

聊天栏显示 `42`。Java 实现参与的是构建过程；Minecraft 运行的是生成的数据包命令。

## 5. 测试 Java 计算

`src/test/java/example/mni/ExampleTest.java`：

```java
package example.mni;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class ExampleTest {
    @Test
    void answerIs42() {
        assertEquals(42, Example.answerValue());
    }
}
```

```sh
mcfpp test
```

这个测试检查 `answerValue()` 的 Java 计算。`mcfpp build` 则同时检查 Java 编译、MCFPP 声明绑定和数据包生成。将计算提取为普通 Java 方法，可以直接为它编写单元测试。

## 接下来读什么

- [参数与返回值](./02mni-framework-implementation)：接收 MCFPP 数据，处理运行时整数。
- [从 Java 生成命令](./05access)：让入口生成游戏中执行的操作。
- [Gradle 与测试配置](../10gradle/01gradle-configuration)：添加 Java 依赖和测试设置。
- [MNI 宏](../mni-macros/overview)：生成表达式、循环和用户回调，适合编写宏库。
