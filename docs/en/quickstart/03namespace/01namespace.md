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
