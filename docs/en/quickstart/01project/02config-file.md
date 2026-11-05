---
lastUpdated: true
---

# Project configuration

Use `mcfpp.toml` in the project root. The CLI searches parent directories for this file. Use `--project` to select a project explicitly.

## A complete configuration

```toml
schema = 1
name = "hello"
namespace = "hello"
version = "1.21.8"
description = "My first MCFPP datapack"
sourcePath = "src/main/mcfpp"
dataPath = "src/main/resources/data"
targetPath = "build"

[toolchain]
version = "java21-v1"

[mni]
enabled = false
```

| Field | Purpose |
| --- | --- |
| `schema` | Configuration format version, currently `1` |
| `name` | Project name and output datapack directory name |
| `namespace` | Default namespace |
| `version` | Minecraft target version for this build |
| `description` | Datapack description |
| `sourcePath` | Directory that contains MCFPP source files |
| `dataPath` | Extra resources copied into the datapack's `data/` directory |
| `targetPath` | Build output directory inside the project |
| `toolchain.version` | Toolchain identifier used by the CLI |
| `mni.enabled` | Enables Kotlin MNI sources and dependencies |

Paths are relative to the project root. The compiler reads `.mcfpp` files recursively. Use a separate output directory, such as `build` or `out`. `mcfpp clean` deletes this directory.

## Compiler options

Set compiler options in the top-level `args` array. Place this line before the first `[table]`:

```toml
args = ["-level=INFO", "--dump-ir"]
```

Command options override matching options in the file:

```sh
mcfpp build -level=WARN
mcfpp build --dump-ir=inspect
mcfpp --project ./hello build
```

`--dump-ir=inspect` writes IR to `build/inspect/`. See [Build output and IR](./04build-and-ir).

## Dependencies and MNI

Declare MCFPP libraries and JVM dependencies in `mcfpp-packages.json`. The CLI updates `mcfpp.lock` and the MNI project's `mcfpp-mni.lock`. Commit configuration, dependency declarations, and lockfiles.

The `[mni]` table supports JVM repositories, plugins, and Gradle extensions. See [Gradle and Kotlin builds](../12gradle/01gradle-configuration).

See [Minecraft target versions](../minecraft-versions) for version conditions.
