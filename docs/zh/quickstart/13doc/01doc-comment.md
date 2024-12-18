---
lastUpdated: true
---

# 文档注释<Badge type="tip">未来特性</Badge>

作为MCFPP中的第三种注释，文档注释可以用来给你的项目自动生成一份文档。MCFPP的文档注释是标签语法和Markdown的混合体，你可以使用标签注释来提供必要的关键信息，同时用Markdown来书写详细的文档内容。

## 语法

文档注释使用`#{`开头，以`#}`结束，其中即为文档注释。文档注释的每一行可以使用`#`开头，`#`不会被作为注释的一部分。

标签注释必须写在Markdown之前。

文档注释可以写在任何声明的上方，但是局部变量的文档注释不会被提取到生成的文档中，仅用于IDE的提示。

以下是一个文档注释的例子：

```mcfpp

#{
    @base 苦力怕

    超级苦力怕的实现类
}#
@Base<"creeper">
class SuperCreeper{

    #{
        苦力怕会给予的效果列表
    }#
    list effectList = ["wither", "poison", "slowness", "hunger", "blindness", "weakness"];

    #{
        @return 一个随机效果

        获取一个随机效果
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

## 标签

有些标签只能用于实体模板，有些只能用于函数，有些则只能用于变量或者成员，还有一些是通用的。

### 通用标签

- `@see 引用`：指定参考的文档。
- `@since 版本`：指定从哪个版本开始引入的。
- `@deprecated 版本`：指定从哪个版本开始废弃的。
- `@version 版本`：指定版本号。
- `@author 作者`：指定作者。

### 实体模板标签

- `@base 描述`：指定实体的基实体。
- `@param 泛型参数名 描述`：指定泛型参数的描述。

### 函数标签

- `@return 描述`：指定返回值的描述。
- `@throws 异常 描述`：指定抛出的异常的描述。
- `@param 参数 描述`：指定参数的描述。
- `@context <entity|pos|rotation|dimension> 描述`：指定上下文的描述。一般是函数的执行环境。