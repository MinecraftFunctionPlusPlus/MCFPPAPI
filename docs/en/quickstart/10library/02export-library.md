---
lastUpdated: true
---

# Export an MCFPP library

A library contains reusable functions, types, and resources. After installation, the compiler can analyze function bodies for actual calls.

## Write the library

In a new project, use this `mcfpp.toml`:

```toml
schema = 1
name = "score-utils"
namespace = "example.utils"
version = "1.21.8"
sourcePath = "src/main/mcfpp"
targetPath = "build"
dataPath = "src/main/resources/data"
noDatapack = true
args = ["-isLib"]

[library]
coordinate = "example:score-utils"
version = "1.0.0"
classifier = "mcfpp"
```

Create `src/main/mcfpp/rewards.mcfpp`:

```mcfpp
namespace example.utils

func addBonus(score: int): int {
    return score + 5
}
```

Run `mcfpp build`. Output includes `build/bin.mclib`, `build/module.json`, and module resources. `noDatapack = true` selects library output. `-isLib` applies library entry rules.

## Create a package

Mcfpm handles packaging and repository publication. Create `mcfpm.toml` in the project root:

```toml
schema = 1

[package]
id = "example:score-utils"
version = "1.0.0"
license = "MIT"
minecraft = "1.21.8"

[tool]
consumer-profile = "all"
```

Keep the package ID, version, and Minecraft target consistent with `mcfpp.toml`. Then run:

```sh
mcfpm pack --input build --type compiler.mcfpp.library --classifier mcfpp --output score-utils-1.0.0-mcfpp.zip --register
```

The archive is the library payload. Follow your repository's Mcfpm publication process to provide its descriptor and payload. `mcfpp build` compiles the library. `mcfpm pack` creates its package.

## Use the published library

After publication to a configured repository, a consumer runs:

```sh
mcfpp add 'example:score-utils@^1.0.0'
mcfpp build
```

Import `example.utils:*` and call `addBonus(10)`. Package coordinates select an installed package. Namespaces select names in source code.

Publish bodies, resources, and dependency metadata together. The final datapack retains library resources according to [references](../01project/04build-and-ir).
