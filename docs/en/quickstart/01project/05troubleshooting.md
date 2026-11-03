---
lastUpdated: true
---

# Resolve build problems

## Check tools and project selection

Check synchronization and the JDK in IDEA's **MCFPP** tool window. In a terminal, run:

```sh
mcfpp --version
mcfpp --project ./hello build
```

Java MNI uses JDK 21. Select it through `MCFPP_JAVA_HOME` or IDEA settings. Source links in the console open the affected line.

## Kotlin reflection in a single JAR

The current minimized development JAR reports `KotlinReflectionNotSupportedError` for some generic NBT calls. A complete CLI runtime needs a matching `kotlin-reflect` library in `lib`.

Use the full distribution's launcher. For a manual launch, include the CLI JAR and matching reflection library in the classpath. The current build uses Kotlin `1.9.20`.

This Windows example assumes `mcfpp-cli.jar` and `lib/kotlin-reflect-1.9.20.jar` in the current directory:

```powershell
java -cp "mcfpp-cli.jar;lib/kotlin-reflect-1.9.20.jar" top.mcfpp.MCFPPKt build
```

Linux and macOS use a colon between classpath entries:

```sh
java -cp "mcfpp-cli.jar:lib/kotlin-reflect-1.9.20.jar" top.mcfpp.MCFPPKt build
```

This is a distribution dependency issue. Keep source declarations in the form shown under [NBT address references](../02base/06references).

## Lockfiles and cached dependencies

After dependency declarations change, run `mcfpp install` to update locks. Run `mcfpp update` to select newer versions within declared ranges.

Prepare dependencies online before an offline build. `--offline` needs the required Gradle distribution and Java dependencies in the local cache.
