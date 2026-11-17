---
lastUpdated: true
---

# Scalar math

Import `mcfpp.math:*` to compute square roots, remainders and interpolation in a pack. This example finds a point a quarter of the way along a path from 0 to 8.

```mcfpp
import mcfpp.math:*

func main() {
    print(isqrt(26))
    print(floorMod(-1, 4))
    print(lerp(0.0, 8.0, 0.25))
}
```

`isqrt(26)` gives `5` and `floorMod(-1, 4)` gives `3`, useful for wrapping an index. `lerp` uses `a + (b - a) * t` and gives `2.0`. It permits extrapolation. Use `clamp(value, lower, upper)` when you need to keep a value inside an interval.

Trigonometric functions take radians. `sinCos(angle)` returns both `sin` and `cos` fields. `pow(float, float)` requires target 26.3. Native math calls compute their results when the pack runs. Store the result in a `var`; a `const` initializer requires a compile-time value.
