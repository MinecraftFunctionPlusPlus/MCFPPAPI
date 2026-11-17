---
lastUpdated: true
---

# Vanilla resources and entry points

Keep handwritten functions, advancements and predicates under `src/main/resources/data/<namespace>/`. Put client assets such as translations, models and textures under `src/main/resources/assets/<namespace>/`. A build writes the datapack to `build/<name>` and, when it finds assets, the resource pack to `build/<name>-resources`. Install the first in the world’s `datapacks` and enable the second on the client.

## Call an MCFPP function from an advancement

```toml
[entrypoints]
"showcase.resources:on_use" = "showcase.resources:handleUse"
```

An advancement can now name `showcase.resources:on_use` as its reward function. The compiler generates a wrapper that preserves the caller’s executor and position and handles the MCFPP call frame. The right-hand name is case-sensitive and must identify a unique public top-level function with no arguments and a `void` result. Use the public ID in raw functions and tags as well.

When handwritten resources collide with compiler output, the build reports their paths. Declare intentional replacements in the top-level `resourceOverrides` array. Exported entry points are reserved. Function tags merge their entries, including required load and tick functions.

[Follow a spyglass advancement from JSON to MCFPP and client translations](../../examples/08-vanilla-resources)
