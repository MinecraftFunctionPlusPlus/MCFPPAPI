---
lastUpdated: true
prev: false
next:
  text: Create a project
  link: /en/quickstart/01project/01create-project
---

# Documentation map

Follow this development path to create a project and produce a datapack. The sidebar groups pages by development task and language feature.

## Complete a project

1. [Create a project](./01project/01create-project): choose an ordinary project or a Kotlin MNI project.
2. [Develop in IDEA](./01project/03idea): edit, organize saved code, synchronize dependencies, and run tasks.
3. [Configure the project](./01project/02config-file): select the Minecraft version, directories, and compiler options.
4. [Manage dependencies](./10library/01import-and-use): add libraries and use lock files.
5. [Build and inspect IR](./01project/04build-and-ir): find the datapack and trace compilation.

## Find a language feature

| Task | Guide |
| --- | --- |
| Declare variables, constants, and type aliases | [Variables and types](./02base/01variables) |
| Convert numbers and understand `as` and assignment | [Conversions and type views](./advanced/conversions) |
| Define functions, default arguments, and extension syntax | [Functions](./04function/01define-and-call), [Defaults and extensions](./advanced/functions) |
| Use callbacks, implicit `it`, and trailing lambdas | [Lambdas and function types](./04function/05lambda) |
| Transform, select, and accumulate values | [Collection callbacks](./advanced/collections) |
| Use read-only lists, NBT arrays, and integer ranges | [Containers and ranges](./advanced/containers) |
| Read and write game scores and NBT | [ScoreRef and NBTRef](./02base/06references) |
| Select entities, change identity and position, and access passengers | [Entities and contexts](./minecraft/entities) |
| Distinguish absent data from zero and read command results | [Reading results](./minecraft/read-results) |
| Define structured data and constructors | [Data templates](./09template/01define-and-instantiate) |
| Control property access | [Properties and operators](./advanced/members) |
| Name a fixed set of choices | [Enumerations](./advanced/enums) |
| Share singleton state and type-related behavior | [Singletons and companion objects](./09template/05object) |
| Use inheritance, abstract methods, and multiple parents | [Inheritance](./09template/06inheritance) |
| Write functions for several types | [Generic functions and type parameters](./07generic/02generic_function) |
| Select object field types | [Generic data templates](./07generic/03generic_class) |
| Supply fixed numeric configuration | [Compilation parameters and known values](./07generic/01concrete_var) |
| Specify generic parameter direction | [in and out](./advanced/variance) |
| Generate code for multiple Minecraft versions | [Version conditions](./minecraft-versions) |

## Learn MNI

Start with a complete project. Read these pages in order:

1. [Kotlin MNI introduction](./11mni/01mni-framework): create a Kotlin project, declare a macro, and call it from MCFPP.
2. [Parameters and results](./11mni/02mni-framework-implementation): receive ordinary and compilation parameters, then return MCFPP values.
3. [Generate commands](./11mni/05access): produce operations that execute in the game.
4. [Gradle and Kotlin tests](./12gradle/01gradle-configuration): configure dependencies and tests.

For libraries that combine expressions, loops, or user callbacks, continue with [MNI macro introduction](./mni-macros/overview). It starts with call preparation, then covers parameters, callbacks, Minecraft operations, and template processors.

Read the [API reference](/en/api/index) for annotation fields and entry signatures. Read [Troubleshooting](./01project/05troubleshooting) for tool configuration and synchronization problems.
