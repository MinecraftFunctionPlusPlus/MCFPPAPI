---
lastUpdated: true
---

# Create a project

An MCFPP project contains configuration, source code, and resources. The IDEA wizard and CLI use the same templates. An MNI project also contains Kotlin source code and JUnit tests.

## Create a project in IDEA

1. Install the MCFPP plugin.
2. Select **File → New → Project → MCFPP**.
3. Enter the name and directory.
4. Select JDK 21.
5. Wait for synchronization.
6. Open `src/main/mcfpp/main.mcfpp`.
7. Select **MCFPP → Build** in the right tool window.

Select **MCFPP MNI** for a project with Kotlin extensions. See [MNI introduction](../11mni/01mni-framework) for the generated example.

The plugin includes matching CLI, standard library, language server, and formatting tools. JDK 21 runs the compiler and MNI build. Node.js 20 or later runs the formatting service. Configure paths in **Settings → Tools → MCFPP**.

## Create a project with the CLI

```sh
mcfpp init hello
cd hello
mcfpp build
```

For a JAR distribution, use this form. Substitute the path to your CLI JAR:

```sh
java -jar /path/to/mcfpp-cli.jar init hello
cd hello
java -jar /path/to/mcfpp-cli.jar build
```

The project contains these files:

```text
hello/
├── mcfpp.toml
├── mcfpp-packages.json
├── src/main/mcfpp/main.mcfpp
├── src/main/resources/data/
└── src/test/mcfpp/
```

`mcfpp.toml` stores project configuration. `mcfpp-packages.json` stores dependency declarations. Builds use `.mcfpp/` for generated files and write output to `build/`.

## Write your first function

`src/main/mcfpp/main.mcfpp`:

```mcfpp
func main() {
    print("Hello MCFPP!")
}
```

`mcfpp init hello` sets the default namespace to `hello`. The generated datapack directory is `build/hello/`.

1. Copy `build/hello/` into the world's `datapacks/` directory.
2. Run `/reload` in the game.
3. Run `/function hello:main`.

The chat displays `Hello MCFPP!`. `main` is a callable function. Use [top-level statements](../02base/04top-statements) for initialization when the datapack loads.

Continue with [Develop in IDEA](./03idea), [Project configuration](./02config-file), and [Build output and IR](./04build-and-ir).

See [Resolve build problems](./05troubleshooting) for tool and runtime issues.
