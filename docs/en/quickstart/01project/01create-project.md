---
lastUpdated: true
---

# Getting Started

MCFPP currently offers two usage methods: directly using the command line or building with Gradle. For simple functionalities, the command line is recommended. Gradle provides more extensive support, such as MNI.

## Compiling with Command Line

You can download the latest version of the MCFPP compiler from the release page on [GitHub](https://github.com/MinecraftFunctionPlusPlus/MCFPP/releases), which should be a Jar file. MCFPP requires Java 21 or higher. You can place it anywhere as long as you can locate it in the command line.

First, create a project folder and a project configuration file. You can find the detailed format of the project configuration file in the next section. In this example, we create an `example.json` as the project configuration file.

```json
{
  "description": "",
  "namespace": "mcfpp",
  "targetPath": "D:\\.minecraft\\saves\\MCFPP Example\\datapacks"
}
```

Next, create a simple mcfpp file, such as `example.mcfpp`:

```mcfpp
func hello(){
    print("Hello World");
}
```

Then, compile the project using the command line:

```shell
java -jar mcfpp.jar example.json
```

This command compiles `example.mcfpp` into a data pack and outputs it to the `D:\.minecraft\saves\MCFPP Example\datapacks` directory. You can then load the data pack in the game and run `function mcfpp:hello` to see the effect.

## Building with Gradle

TODO
