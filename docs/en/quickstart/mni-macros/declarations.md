---
lastUpdated: true
---

# Template processors: generate methods for data

Expression macros process function calls. A template processor handles a `data` declaration and adds methods. For example, it can generate `load()` and `save()` from fields.

This page first generates an `answer()` method returning `42`. It then explains field synchronization.

## When the processor runs

| Stage | Compiler action |
| --- | --- |
| Read the template declaration | Collect fields, methods, and annotations |
| Invoke `TemplateProcessor` | Supply template information to Java |
| Receive generated content | Add methods to the template |
| Compile ordinary source calls | Check and compile calls such as `reward.answer()` |

A processor can therefore choose methods from the available fields. During play, instances execute commands already generated for those methods.

## Complete processor class

`example/macros/AnswerProcessor.java`:

```java
package example.macros;

import java.util.List;
import top.mcfpp.mni.api.*;

public final class AnswerProcessor implements TemplateProcessor {
    @Override
    public DeclarationEdits expand(DeclarationContext context, TemplateView template) {
        FunctionSignature<IntT> signature = FunctionSignature.of(
            List.of(), context.types().intType());
        MethodEdit answer = context.declarations().method(
            template.type(), "answer", signature,
            method -> {
                CodeBuilder code = method.builder();
                code.yield(code.intLiteral(42));
            });
        return context.declarations().edits(List.of(answer));
    }
}
```

Read `expand` through its inputs and output:

| Name | Purpose here |
| --- | --- |
| `template` | Read information about the current data template |
| `context` | Supply method generation and diagnostic services |
| `signature` | Describe `answer(): int` |
| `answer` | Hold one generated method addition |
| `DeclarationEdits` | Deliver the requested additions to the compiler |

`template.type()` identifies the method owner. `declarations().method(...)` creates a public instance method. `method.builder()` supplies the body builder. `yield(intLiteral(42))` supplies its result.

## Associate the annotation with the processor

Library loading calls `namespace.registerTemplateProcessor(annotationName, processorClass)` to establish the association. For example, a namespace can associate `Answer` with `AnswerProcessor`.

After that preparation, callers can write:

```mcfpp
@Answer
data Reward {}

func inspectReward() {
    var reward = Reward()
    print(reward.answer())
}
```

Calling `inspectReward` displays `42`. The processor supplies the public `answer` method. Read [Macro introduction](./overview#make-the-macro-callable) for annotations and library loading.

## Read fields and generate instance access

`TemplateView` supplies this information:

| Interface | Content |
| --- | --- |
| `fields()` | Field names, types, writability, and source locations |
| `fieldDeclarations()` | Field owners, access levels, nullability, and annotations |
| `methods()` | Method names, signatures, readonly parameters, and modifiers |
| `annotations()` | Template annotation names and constant arguments |
| `source()` | The template declaration location |

Within a generated instance method, `method.self()` represents the current instance. `code.fieldRef(method.self(), field)` selects one of its fields. `assign` can then write it.

Place new behavior in new methods. Existing visible methods retain their definitions. The compiler checks field access and parameter types.

## Complete case: synchronize fields with scores

The repository library `examples/mni/score-mapping` uses `@ScoreMapping` to select a fixed holder. `@Score` associates each field with an objective:

```mcfpp
@ScoreMapping("#scores")
data Player {
    @Score("health_hp")
    var health: int = 0

    @Score("state_alive")
    var alive: bool = false
}

func inspectPlayer() {
    var player = Player()
    player.health = 7
    player.alive = true
    player.save()

    player.health = 0
    player.alive = false
    player.load()
    print(player.health)
    print(player.alive)
}
```

First create the `health_hp` and `state_alive` objectives in the game with `dummy` criteria. Run `inspectPlayer` with this example library loaded. `save` stores the fields as scores. `load` reads them back, producing `7` and `true`.

The processor generates both methods. Integers retain their values. Booleans use `0` or `1`. The Java implementation is `examples/mni/score-mapping/provider/java/example/mniscore/JavaScoreMappingProcessor.java`.

Run `./gradlew test --tests top.mcfpp.test.MniScoreMappingTest` from the compiler repository root to check generation and field access.
