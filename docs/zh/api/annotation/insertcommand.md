# public @interface InsertCommand<Badge type="tip">已废弃</Badge>

```java
package top.mcfpp.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.CONSTRUCTOR})
@Retention(RetentionPolicy.RUNTIME)
public @interface InsertCommand {
}
```

InsertCommand类用来标记一个JVM方法是否调用了`Function.addCommand`方法，也就是是否往一个函数里面添加了命令。由于Java和Kotlin之间的注解并不互通，因此此注解实际已经废弃。

## 函数格式

这个注解对函数格式没有要求。
