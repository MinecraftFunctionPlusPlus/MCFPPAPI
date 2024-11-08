---
lastUpdated: true
---

# 顶层语句<Badge type="warning">可能更改</Badge>

在MCFPP中，允许在文件的开始直接编写语句而无需额外定义函数，即顶层语句。顶层语句处于一个隐式的函数中，这个函数每个文件有且只有一个，且不能被外部调用。它的返回值类型为`void`。

```mcfpp
print("Top statement");

func main(){
    print("Function");
}
```

在编译后，会生成两个函数——分别对应main函数以及顶层语句对应的默认函数。

顶层语句只能在文件的开始编写，即在函数定义或类定义之前。顶层语句可以调用文件中声明的其他函数和类

```mcfpp
main();

func main(){
    print("Function");
}
```
