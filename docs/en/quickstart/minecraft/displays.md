---
lastUpdated: true
---

# Display entities and scheduling

Use an `EntityRef<ItemDisplay>` to operate on a spawned item display. `transform.y` moves the model relative to the entity. `transform.scale.x` changes one component of its scale. Use `entityByUUID<ItemDisplay>(id)` for a known UUID. The caller supplies the type; use `checkType<ItemDisplay>()` to check the entity at runtime.

```mcfpp
func timers() {
    loop(10) { frame ->
        /say repeated-every-10-ticks
        return frame < 2
    }
    schedule(20) {
        /say after-20-ticks
    }
}
```

The first `loop(10)` callback runs after 10 ticks with `frame` equal to 0. It runs again after 20 and 30 ticks, then stops when the callback returns `false`. `schedule(20)` fires once after 20 ticks. Use `tick { frame -> ... }` to update every tick, starting on the next tick.

A delayed task captures local values when registered and runs in the server scheduler’s context. Capture a typed reference to address the same entity across ticks, then write `display.transform.y` inside the callback. [Example 07](../../examples/07-display-animation) writes the height from a bounce curve and plays it in the IDEA preview.
