---
lastUpdated: true
---

# 测试 MCFPP 源码

把下面的文件保存为 `src/test/mcfpp/arithmetic_test.mcfpp`。测试可以直接使用本工程的正式源码。`@Test` 标记顶层、无参数、返回 `void` 的函数。

```mcfpp
import mcfpp.test:*

@Test
func addition() {
    assertEquals(3, 1 + 2)
}
```

先用 `--list` 编译并列出测试，再让 DatapackSandbox（DSB）执行。下例第三条命令用于示例 09，把 JAR 路径换成本机路径。

```sh
mcfpp test --list
mcfpp test --dsb-jar /path/to/datapack-sandbox-cli.jar
mcfpp test --tests 'showcase.debugger:recursiveResult' --dsb-jar /path/to/datapack-sandbox-cli.jar
```

每个测试都使用独立的世界。加载数据包后，运行器依次执行同文件的 `@BeforeEach`、测试函数和 `@AfterEach`。用 `@Disabled("原因")` 保留并跳过某个测试。`assertEquals` 的参数顺序是期望值、实际值，最后可加消息。

在 IDEA 中点击测试函数旁的运行按钮，可以从结果树跳转回源码。终端中可以设置 `DSB_JAR` 代替每次传参。CI 可读取 `build/tests/mcfpp/TEST-mcfpp.xml`。`--tests` 支持 `*` 并只选择 MCFPP 测试；不加筛选的 `mcfpp test` 在启用 MNI 的工程还会运行 JVM 测试。

[跟随示例 09 调试失败和递归调用](/zh/examples/09-tests-debugger)
