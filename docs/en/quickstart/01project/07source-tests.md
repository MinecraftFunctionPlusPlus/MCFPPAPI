---
lastUpdated: true
---

# Test MCFPP source

Save this file as `src/test/mcfpp/arithmetic_test.mcfpp`. Tests can call the project’s production functions. Annotate a top-level function with no arguments and a `void` return type with `@Test`.

```mcfpp
import mcfpp.test:*

@Test
func addition() {
    assertEquals(3, 1 + 2)
}
```

First compile and discover the tests with `--list`, then run them in DatapackSandbox (DSB). The third command selects a single test in example 09. Substitute your local JAR path.

```sh
mcfpp test --list
mcfpp test --dsb-jar /path/to/datapack-sandbox-cli.jar
mcfpp test --tests 'showcase.debugger:recursiveResult' --dsb-jar /path/to/datapack-sandbox-cli.jar
```

Each test gets its own world. After loading the pack, the runner executes the file’s `@BeforeEach` functions, the test, then its `@AfterEach` functions. Mark a test `@Disabled("reason")` to discover it but skip execution. Pass the expected value first to `assertEquals`, then the actual value and an optional message.

In IDEA, click the gutter action on a test and use the result tree to navigate to its source. In a terminal, set `DSB_JAR` to reuse the runtime path. CI can read `build/tests/mcfpp/TEST-mcfpp.xml`. The `--tests` filter accepts `*` and selects MCFPP tests only. An unfiltered `mcfpp test` also runs JVM tests in an MNI project.

[Follow example 09 through tests and recursive calls](/en/examples/09-tests-debugger)
