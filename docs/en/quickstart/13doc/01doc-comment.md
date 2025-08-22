---
lastUpdated: true
---

# Documentation Comments <Badge type="tip">Future Feature</Badge>

As the third type of comment in MCFPP, documentation comments can be used to automatically generate documentation for your project. MCFPP's documentation comments are a mix of tag syntax and Markdown. You can use tag comments to provide necessary key information and Markdown to write detailed documentation.

## Syntax

Documentation comments start with `#{` and end with `#}`, with the content in between being the documentation comment. Each line of the documentation comment can start with `#`, which will not be considered part of the comment.

Tag comments must be written before the Markdown content.

Documentation comments can be written above any declaration, but local variable documentation comments will not be extracted into the generated documentation and are only used for IDE hints.

Here is an example of a documentation comment:

```mcfpp

#{
@base Creeper

Implementation class for Super Creeper
}#
@Base<"creeper">
class SuperCreeper{

    #{
    List of effects the creeper will give
    }#
    var effectList = ["wither", "poison", "slowness", "hunger", "blindness", "weakness"];

    #{
    @return A random effect

    Get a random effect
    }#
    func getEffect() -> string {
        return effectList.random();
    }

    override func tick(){
        if(@a[distance = 0..5].exist()){
            effect(@a[distance = 0..5], getEffect(), 1, 10);
        }
    }

}
```

## Tags

Some tags can only be used for entity templates, some only for functions, some only for variables or members, and some are general.

### General Tags

- `@see Reference`: Specifies a reference document.
- `@since Version`: Specifies the version from which it was introduced.
- `@deprecated Version`: Specifies the version from which it was deprecated.
- `@version Version`: Specifies the version number.
- `@author Author`: Specifies the author.

### Entity Template Tags

- `@base Description`: Specifies the base entity.
- `@param GenericParameterName Description`: Specifies the description of a generic parameter.

### Function Tags

- `@return Description`: Specifies the return value description.
- `@throws Exception Description`: Specifies the description of thrown exceptions.
- `@param Parameter Description`: Specifies the description of a parameter.
- `@context <entity|pos|rotation|dimension> Description`: Specifies the context description, usually the execution environment of the function.
