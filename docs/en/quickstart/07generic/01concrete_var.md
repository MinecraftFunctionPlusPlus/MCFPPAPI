---
lastUpdate: true
---

# Compile-time Constants

During the compilation process, the compiler will optimize certain variables whose values it can determine, for example:

```mcfpp
int i = 5;
int j = 5;

print(i + j);
```

In this case, the compiler knows the values of `i` and `j`, so it can directly compute `i + j` as 10. The `print` function can directly output 10 without needing to convert it into the raw JSON text for a scoreboard.

These kinds of variables are called compile-time constants (referred to as `Concrete Var` in MCFPP). Compile-time constants and regular variables can be converted between each other, for example:

```mcfpp
int i = 5;
dynamic j;
i = j;
```

In this example, although the compiler can initially track the value of `i`, but later in the code, `i` is assigned the value of `j`, and `j` is marked with the keyword `dynamic`, indicating that its value is indeterminate at the time of declaration. As a result, the compiler loses track of the value of `i`.

Similarly, if a regular variable is assigned a fixed value or a compile-time constant, the compiler will be able to determine the value of that variable, and it will also become a compile-time constant.

It is important to note that the compiler will never track class member variables. Even if a class member variable is assigned a fixed value, the compiler will still treat it as a regular variable.
