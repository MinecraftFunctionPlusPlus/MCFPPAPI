---
lastUpdate: true
---

# Namespace

The namespace in MCFPP is same as the namespace in Minecraft. That means, namespace only can be the combination of lowercase letters, numbers, dots and underlines.

You can declare a namespace in a file, so all functions and variables in the file will be placed in the namespace. For example:

```mcfpp
namespace test;

func test(){    # test:test function 
    print(i);
}
```

You can only define namespace once in a file.

If no namespace is declared, the namespace of the file will be determined by the relative path of the file to the source code directory. For example, if the source code directory is `src/main/mcfpp`, then the namespace of the file `src/main/mcfpp/test/test.mcfpp` will be `test.test`. The source code path is determined by the `sourcePath` in the project configuration file.

## Compile-time commands <Badge type="tip">Technical</Badge>

If an unnamed mcfpp file (i.e., a file with the .mcfpp extension) is placed under a namespace, the compiler treats that file as containing compile-time commands.

Compile-time commands run after the `INDEX_TYPE` compilation phase and before the `stageProcessor[INDEX_TYPE]` processor executes. A compile-time command is a single-line comment starting with `#>`; the rest of the line is the command. Currently supported commands:

### `injectedBy <classPath>`

Injects a function defined by an MNI class into the current namespace as a global function.

- `classPath` — the fully qualified Java class name of the MNI class.

Example:

```mcfpp
#> injectedBy top.mcfpp.mni.minecraft.StdCommands
```
