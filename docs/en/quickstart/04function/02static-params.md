---
lastUpdate: true
---

# `static`<Badge type="tip">Possible changes</Badge>

`static` keyword is used to define a static parameter. Static parameter represents, during the process of transferring parameter,  it'll transfer parameter itself but not it's value, so the change of parameter in the function would effect the variable out of the function. For example:

```mcfpp
func test(static int a){
    a = 5;
}

void main(){
    int a = 0;
    test(a);
    print(a);  #output 5
}
```
