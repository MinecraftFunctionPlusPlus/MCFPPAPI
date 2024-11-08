---
lastUpdate: true
---

# JavaVar

In MCFPP, there is a special type of variable called `JavaVar`. It can only be returned by MNI functions and cannot be created directly. `JavaVar` exists only during the compilation process and represents a Java variable in the compilation phase, making it a part of the MNI framework.

`JavaVar` variables can only be obtained through the return values of MNI functions. For example, consider the following MNI function implementation:

```mcfpp
func getJavaVar() = top.mcfpp.lang.JavaVar.getJavaVar;
```

```java
import java.util.Random;

//...
method.add("getJavaVar", (readonlyArgs, normalArgs, caller, returnVar) -> {
    returnVar.value = new JavaVar(new Random());    // Returns a random number generator
    return null;
});
//...
```

This MNI function will return a `JavaVar` variable, whose value is an instance of the `Random` class. Next, we can call this function in MCFPP:

```mcfpp
var random = getJavaVar();
```

Now, `random` is a variable of type `JavaVar`, and its value is an instance of the `Random` class. We can then call its various methods:

```mcfpp
# Call a method
var nextInt = random.nextInt(100);
```

Calling a member method on a `JavaVar` type variable will return another `JavaVar` type variable. Thanks to the similarity between MCFPP and Java/Kotlin syntax, we can almost seamlessly call Java/Kotlin methods within MCFPP.

Additionally, in appropriate cases, the compiler will automatically convert certain types between MCFPP variables and Java variables.

```mcfpp
int qwq = 100;  # MCFPP variable

var nextInt = random.nextInt(qwq);  # MCFPP variable automatically converts to a Java variable and is passed into the Java method

int nextMCFPPInt = nextInt;    # Java variable automatically converts back to an MCFPP variable
```

This kind of conversion has a prerequisite: the MCFPP variable must be a known type in order to be automatically converted into a corresponding Java variable. Otherwise, it will be converted into the `Var` class, which is the base class for all MCFPP variables in the compiler. Naturally, if a Java method expects a `Var` type parameter by default, the compiler will not perform the automatic conversion.
