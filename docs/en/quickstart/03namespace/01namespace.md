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

The same, you can also define this namespace in the project configuration file.

```json
{
    "file":[
        "*"
        "D:/workspace/mcfpp/project/*"
    ],
    "version":"1.19.4",
    "include":[
        "D:/workspace/mcfpp/another_project.json"
    ],
    "targetPath":"./out",
    //The default namespace of the project. Optional, default is ‘default’ // [!code focus]
    "namespace":"mcfpp" // [!code focus]
}
```
