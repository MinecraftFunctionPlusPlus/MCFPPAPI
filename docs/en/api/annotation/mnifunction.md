---
lastUpdated: true
---

# MNIFunction

`top.mcfpp.annotations.MNIFunction` describes an ordinary Java MNI entry. Follow [MNI introduction](/en/quickstart/11mni/01mni-framework) for project creation and source binding.

## Wrapper entry signature

```text
public static void method(
    readonly parameters...,
    ordinary parameters...,
    member caller,
    ValueWrapper<ResultType> result
)
```

Free functions omit the member caller. Entries returning `void` omit the result wrapper. Inputs use `Var` subclasses, such as `MCInt`. Entries with results supply them through `result.set(value)`.

Read [MNI parameters and results](/en/quickstart/11mni/02mni-framework-implementation) for complete matching examples.

## Annotation fields

| Field | Default | Meaning |
| --- | --- | --- |
| `readOnlyParams` | `{}` | Readonly parameter types in order |
| `normalParams` | `{}` | Ordinary parameter types in order |
| `caller` | `"void"` | A member caller type marker |
| `returnType` | `"void"` | MCFPP result type |
| `override` | `false` | Mark an inherited method override |
| `genericType` | `{}` | Type parameter names for a generic caller |
| `tag` | `{}` | Additional tags |
| `identifier` | `""` | Registration name, defaulting to the Java method name |
| `returnsConstWhenArgsConst` | `false` | Declare constant results for constant inputs |

The annotation targets Java methods and remains available at JVM runtime for compiler discovery. Explicit source declarations define source interfaces and actual caller types. `caller` supplies a type marker.

## NativeCallContext entry

Another signature is `public static void method(NativeCallContext context)`. This context supplies parameters, the caller, known values, and result publication. Standard library entries use it to access compiler read and write operations.

Property entries use this form. Read [MNIAccessor](./mniaccessor) and [MNIMutator](./mnimutator).
