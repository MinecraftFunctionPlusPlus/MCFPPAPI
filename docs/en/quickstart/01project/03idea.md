---
lastUpdated: true
---

# Develop in IDEA

## Open and synchronize a project

Use **File → Open** to open a directory with `mcfpp.toml`. The plugin reads the CLI project model. It configures source directories, resources, the JDK, and dependencies.

The **MCFPP** tool window displays synchronization status. In MNI projects, Kotlin navigation includes compiler APIs and Maven dependencies. Save configuration changes to start synchronization. You can also select **Synchronize**.

If synchronization fails, the window keeps the last successful model. Use **Synchronize** to retry.

## Edit and format code

The plugin provides completion, parameter hints, documentation, navigation, reference search, and rename. A native MNI declaration identifies a Kotlin/JVM method, for example:

```mcfpp
func add(left: int, right: int): int = example.mni.Arithmetic.add

func main() {
    print(add(20, 22))
}
```

Saving and whole-file formatting use the same sequence:

1. Linter applies safe fixes.
2. Prettier formats the document.
3. The editor refreshes diagnostics.

Select **Code → Reformat Code** for manual formatting. Defaults are four spaces and 100 columns. Project Prettier settings, Linter settings, and ignore files can change this behavior.

Formatting removes trailing spaces and adjusts indentation. Editor diagnostics focus on syntax and code meaning. You can undo formatting. Background changes apply only to the matching document version.

## Run tasks

| Task | Purpose |
| --- | --- |
| **Build** | Prepare dependencies and compile the datapack |
| **Install** | Prepare dependencies |
| **Update** | Update dependencies within declared version ranges |
| **Clean** | Delete build output |
| **Lint** | Check source code |
| **Format Check** | Check formatting |
| **Dump IR** | Build and export readable compiler records |
| **Test** | Run Kotlin/Java tests in an MNI project |

The plugin creates run configurations when it first opens the project. **MCFPP Build** is the default. Configurations support a working directory, environment variables, extra arguments, and `offline` or `locked` options.

Use the top run button or a task button. The Run window supports cancellation, another execution, and source links. After a build, select **Open Build Output** to open the datapack directory.

## Configure tools

Open **Settings → Tools → MCFPP**:

- **JDK 21** runs the CLI and Kotlin MNI builds.
- **Node.js** runs Prettier and Linter.
- **Command service Java** runs the Minecraft command service. Use Java 25.
- **External tool paths** select another CLI or formatting package when required.

The language server needs an IDEA distribution with LSP support. The tool window displays tool versions so you can check the active tools.
