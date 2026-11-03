---
lastUpdated: true
---

# MNI API reference

This section describes Java extension entries and command objects. Start a complete project with the [MNI introduction](/en/quickstart/11mni/01mni-framework).

| API | Purpose |
| --- | --- |
| [MNIFunction](./annotation/mnifunction) | Ordinary native functions and results |
| [MNIMacro](./annotation/mnimacro) | Macros that generate typed code |
| [MNIAccessor](./annotation/mniaccessor) | Native property reads |
| [MNIMutator](./annotation/mnimutator) | Native property writes |
| [MNIMember](./annotation/mnimember) | Member metadata marker |
| [InsertCommand](./annotation/insertcommand) | Command generation marker |
| [Command](./class/command) | Minecraft command fragments |

Ordinary MNI functions receive `Var` subclasses and return results through `ValueWrapper`. Another form receives one `NativeCallContext`. The standard library uses it for receivers, arguments, and backend operations.

Macros describe generated code with `MacroContext`, `Value<T>`, `Expr<T>`, and `Block`. Macros and ordinary native functions serve different extension needs.
