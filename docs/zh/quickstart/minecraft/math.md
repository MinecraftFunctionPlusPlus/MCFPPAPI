---
lastUpdated: true
---

# 标量数学

导入 `mcfpp.math:*` 后可以在数据包里计算平方根、余数和插值。这里把点放在从 0 到 8 的路径的四分之一处。

```mcfpp
import mcfpp.math:*

func main() {
    print(isqrt(26))
    print(floorMod(-1, 4))
    print(lerp(0.0, 8.0, 0.25))
}
```

`isqrt(26)` 得到整数 `5`；`floorMod(-1, 4)` 得到 `3`，适合循环索引；`lerp` 按 `a + (b - a) * t` 得到 `2.0`。`t` 可以超出 0 到 1，需要把数值限制在区间内时用 `clamp(value, lower, upper)`。

三角函数的角度单位是弧度。需要同时得到正弦和余弦时，`sinCos(angle)` 返回具有 `sin`、`cos` 字段的值。`pow(float, float)` 需要 26.3。原生数学函数在数据包运行时计算，结果可以存入 `var`；`const` 初值要求在编译期已知。
