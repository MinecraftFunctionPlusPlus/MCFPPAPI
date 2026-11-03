---
lastUpdated: true
---

# Manage dependencies and use libraries

`mcfpp-packages.json` stores project dependencies. MCFPP libraries use `group:name` with a version range. Java libraries use Maven coordinates.

## Add and remove dependencies

These MCFPP coordinates demonstrate the format. Substitute a library published in your repository:

```sh
mcfpp add 'example:utils@^1.0.0'
mcfpp remove example:utils
```

Use `--mni` for Java dependencies. This example adds Apache Commons Lang:

```sh
mcfpp add --mni org.apache.commons:commons-lang3:3.14.0
mcfpp remove --mni org.apache.commons:commons-lang3
```

Adding a Java dependency enables MNI builds. A dependency file has this form:

```json
{
  "schema": 1,
  "mni": [
    "org.apache.commons:commons-lang3:3.14.0"
  ],
  "mcfpp": {
    "example:utils": "^1.0.0"
  }
}
```

`schema` is `1`. `mni` lists Java dependencies. `mcfpp` maps MCFPP coordinates to version ranges. The CLI updates declarations and lockfiles after preparation succeeds.

## Install, update, and build offline

```sh
mcfpp install
mcfpp build --locked
mcfpp build --locked --offline
mcfpp update
```

`install` prepares dependencies. `build` and `test` also prepare dependencies. A valid lockfile keeps selected versions. `update` selects versions within the declared ranges.

`--locked` requires valid lockfiles and keeps their content. `--offline` uses cached dependencies and tools. Commit lockfiles so other developers can use the same versions.

## Use a library in source

Installation obtains a library. `import` selects its namespace. The library declares its own names.

```text
import example.utils:*

func main() {
    print(formatScore(10))
}
```

This shows a hypothetical library call. Use its documentation for actual names, arguments, and namespaces. See [Namespaces](../03namespace/01namespace) for complete project examples.

In IDEA, use **Add…**, **Remove**, and **Synchronize**. After synchronization, the editor and CLI use the same resolved dependencies.
