---
lastUpdated: true
---

# Configuration File

The project configuration file for MCFPP is a JSON file, typically stored in the root directory of the project. The JSON format is as follows:

```json
{
    // The target Minecraft version to compile for. Only official version numbers are supported.
    "version": "1.21.4",
    // The source code directory of the project. The namespace of the files is determined by their relative path to the source code directory.
    "sourcePath": "src/main/mcfpp/**",
    // Description of the datapack. This is a raw JSON text.
    "description": "",
    // The default namespace for the datapack, which will determine the namespace for datas, for instance storage in the package.
    "namespace": "test",
    // The jar-packaged libraries to be called.
    "jar": [],
    // The output path for the datapack. The datapack and library files will be output to this directory.
    "targetPath": "build",
    // Whether to *not* generate a datapack. Default is false.
    "noDatapack": false,
    // Compilation arguments
    "compileArgs": [
        // Compile in debug mode (for compiler development)
        "-debug", 
        // Ignore the standard library
        "-ignoreStdLib",
        // Whether it is a library
        "-isLib"
    ]
}
