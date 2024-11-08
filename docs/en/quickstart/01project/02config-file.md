---
lastUpdated: true
---

# Configuration File

The project configuration file for MCFPP is a JSON file, typically stored in the root directory of the project. The JSON format is as follows:

```json
{
    // List of project file paths. Use wildcard symbols to select all files.
    "files": [
        "src/main/mcfpp/**"
    ],
    // The source code directory of the project. The namespace of the files is determined by their relative path to the source code directory.
    "sourcePath": "src/main/mcfpp",
    // Description of the datapack. This is a raw JSON text.
    "description": "",
    // The default namespace for the datapack, which will determine the namespace for datas, for instance storage in the package.
    "namespace": "test",
    // The output path for the datapack. The datapack and library files will be output to this directory.
    "targetPath": "src/main/resources/lib",
    // Whether to *not* generate a datapack. Default is false.
    "noDatapack": false,
    // Whether to *ignore* the standard library. Default is false. If set to true, the MCFPP standard library will not be referenced.
    "ignoreStdLib": false,
    // Whether it is a library. Default is false. Libraries do not need to have an entry function.
    "isLib": false
}
