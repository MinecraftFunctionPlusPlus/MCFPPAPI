---
lastUpdate: true
---

# Annotations

You can add annotations to classes, data templates, and method declarations by using the `@` symbol followed by the annotation name and a read-only parameter list. Annotations are part of the MNI framework and only exist during the compilation phase.

## MNI Implementation

```java
// Inherits from DataTemplateAnnotation, indicating that this annotation can only be used on data templates
public class Example extends DataTemplateAnnotation {

    @SuppressWarnings("unused")
    public Example(String className) {
        super("Example", "mcfpp.annotation");
        // RESOVLE_FIELD represents the field resolution phase, after which the annotation will be registered in the compiler
        Project.INSTANCE.getStageProcessor()[Project.CompileStage.RESOVLE_FIELD].add(() -> {
            GlobalField.INSTANCE.getLocalNamespaces().get("mcfpp.annotation").getField().addAnnotation("Example", this.getClass(), false);
            return null;
        });
    }

    // Defines what happens to the data template when the compiler encounters this annotation during the annotation parsing phase
    @Override
    public void forDataObject(@NotNull DataTemplate data) {
        System.out.println(data.getNamespaceID());
    }
}
```

## MCFPP Declaration

WIP
