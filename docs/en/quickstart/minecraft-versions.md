---
lastUpdated: true
---

# Minecraft target versions

`version` in `mcfpp.toml` selects the Minecraft Java Edition target. Each build produces a datapack for one target.

```toml
version = "1.21.8"
```

Build again after changing the version. Use separate `targetPath` directories to keep multiple outputs, such as `build-1.21.8` and `build-26.3`.

## Supported targets

The current target table contains these versions:

| Series | Versions |
| --- | --- |
| 26.x | `26.1`, `26.2`, `26.3` |
| 1.21 | `1.21`, `1.21.1`, `1.21.2`, `1.21.3`, `1.21.4`, `1.21.5`, `1.21.6`, `1.21.7`, `1.21.8` |
| 1.20 | `1.20`, `1.20.1`, `1.20.2`, `1.20.3`, `1.20.4`, `1.20.5`, `1.20.6` |
| 1.19 | `1.19`, `1.19.1`, `1.19.2`, `1.19.3`, `1.19.4` |
| 1.18 | `1.18`, `1.18.1`, `1.18.2` |
| 1.17 | `1.17`, `1.17.1` |
| 1.16 | `1.16`, `1.16.1`, `1.16.2`, `1.16.3`, `1.16.4`, `1.16.5` |
| 1.15 | `1.15`, `1.15.1`, `1.15.2` |
| 1.14 | `1.14`, `1.14.1`, `1.14.2`, `1.14.3`, `1.14.4` |
| 1.13 | `1.13`, `1.13.1`, `1.13.2` |

The target selects pack metadata and command capabilities. Each API still needs the capabilities required by its operations.

## Select source by version

```mcfpp
func main() {
#if MC >= 26.3
    print("Number provider target")
#elif MC >= 26.1
    print("26.x target")
#else
    print("Legacy target")
#endif
}
```

Place each directive on a separate line. Supported comparisons are `==`, `!=`, `<`, `<=`, `>`, and `>=`. The compiler selects branches before parsing. IDEA uses the same project version.

## Floating-point operations

`26.3` uses Minecraft number providers and NBT float. Earlier targets use scoreboard-based floating-point operations. The compiler selects matching standard library and runtime resources from `version`.

Your source can keep the `float` type. After changing targets, inspect the generated commands with [Dump IR](./01project/04build-and-ir).
