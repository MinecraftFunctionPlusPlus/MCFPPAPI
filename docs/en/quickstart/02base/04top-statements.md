---
lastUpdated: true
---

# Top statement 

In MCFPP, allows programming statements in the start of the file and don’t need to declare extra function, that’s the top statement. Top statement places in a hidden function, each file have one and only one of this function, and it cannot be called externally. Its returned value’s type is `void`.

```mcfpp
print("Top statement");

func main(){
    print("Function");
}
```

After compiling, it’ll form two functions —— corresponding to main function and the default functions of top statement respectively.

Top statement only can program in the start of the file, which is before the declaration of any functions or classes. Top statement can call the other functions and classes that’s declared in the file.

```mcfpp
main();

func main(){
    print("Function");
}
```
