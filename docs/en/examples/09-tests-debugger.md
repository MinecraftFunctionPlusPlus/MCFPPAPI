# 09 · Inspect locals during a recursive call

Set a breakpoint on `var result = recurse(3)` and choose **Debug** beside `main`. Add `payload.values[1]` to Watches to see `9`. Step into `recurse`, switch stack frames to inspect each frame’s `depth` and `saved`, then step out to return to `main`.

```mcfpp
func main() {
    var count = 1
    count = increment(count)
    var payload = {values: [2, 9]} as Payload
    var decimal: float = 1.5
    decimal += 0.5
    var result = recurse(3)
    while (count < 4) { count += 1 }
    print(count)
    print(result)
    print(payload.values[1])
}
```

## Try it

Resume execution to see `4`, `6`, `9`. Run the tests separately. `@BeforeEach` sets up the initial score and `@AfterEach` cleans it up. Expect two passes and one skip. To practise locating a failure, temporarily remove `@Disabled` from `pendingFeature` and rerun it.

The in-game entry point is `/function showcase.debugger:main`.

[Full source](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/09-tests-debugger/src/main/mcfpp/main.mcfpp) · [Tests](https://github.com/MinecraftFunctionPlusPlus/MCFPP_Example/blob/8f39d3921157404c642f1613fa40811f35213761/09-tests-debugger/src/test/mcfpp/lifecycle_test.mcfpp)
