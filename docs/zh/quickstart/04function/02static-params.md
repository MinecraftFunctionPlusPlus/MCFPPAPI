---
lastUpdate: true
---

# static关键字<Badge type="tip">可能更改</Badge>

`static`关键字用于声明一个静态参数。静态参数表示，在参数传递的过程中，是传递的参数本身而不是参数的值，因此在函数中对参数的修改会影响外部的变量。例如：

```mcfpp
func test(static a as int){
    a = 5;
}

void main {
    int a = 0;
    test(a);
    print(a);  #输出5
}
```
