---
lastUpdated: true
---

# Template processors: generate data methods

After declaration completion, `TemplateProcessor` reads a `TemplateView` and returns new methods, internal functions, and permitted metadata. This processor generates a public instance method returning `42`:

```kotlin
package example.macros

import top.mcfpp.mni.api.*

class AnswerProcessor : TemplateProcessor {
    override fun expand(context: DeclarationContext, template: TemplateView): DeclarationEdits {
        val signature = FunctionSignature.of(emptyList(), context.types().intType())
        val answer = context.declarations().method(template.type(), "answer", signature) { method ->
            method.builder().kotlin {
                yield(literal(42))
            }
        }
        return context.declarations().edits(listOf(answer))
    }
}
```

Create `src/main/kotlin/example/macros/AnswerProcessor.kt`. A library registration hook associates an existing annotation with the processor using `namespace.registerTemplateProcessor(annotationName, processorClass)`. The processor needs a public no-argument constructor. For a complete annotation and registration implementation, see `examples/mni/score-mapping/provider/kotlin/example/mniscore/KotlinScoreMappingProvider.kt` in the compiler repository.

After registration, source code can use the annotation and call the generated method:

```mcfpp
@Answer
data Reward {}

func main() {
    var reward = Reward()
    print(reward.answer())
}
```

The expected result is `42`. `method.builder().kotlin { ... }` uses the same DSL as macros, and `yield` supplies the method result.

## Read declarations and generate field access

| API | Contents |
| --- | --- |
| `template.type()` | Current owner type |
| `fields()` / `fieldDeclarations()` | Fields, types, writability, access, and annotations |
| `methods()` | Method signatures, readonly parameters, and modifiers |
| `annotations()` / `source()` | Template annotations and source location |
| `method.self()` / `parameters()` | Generated method receiver and parameters |

In the method DSL, `fieldRef(method.self(), field).value = expression` constructs a field write. The field must belong to a valid owner and be accessible and writable. New methods cannot replace existing visible signatures. Self and parameters belong to that method and its valid child scopes.

The score-mapping example generates `load` and `save` from `@ScoreMapping` and `@Score`. Integers retain their value; booleans use `0` or `1`. Run `./gradlew test --tests top.mcfpp.test.MniScoreMappingTest` in the compiler repository to check generation and read/write behavior.
