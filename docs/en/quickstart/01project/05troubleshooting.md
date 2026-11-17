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

Kotlin MNI uses JDK 25. Select it through `MCFPP_JAVA_HOME` or IDEA settings. Source links in the console open the affected line.

## An older CLI reports a Kotlin reflection error

The bundled CLI includes the reflection runtime used by generic NBT calls. If an older installation reports `KotlinReflectionNotSupportedError`, update the plugin together with its CLI, then check **Settings → Tools → MCFPP** for an external CLI path pointing at an older JAR.

The plugin also ships sources for the compiler API and standard library. After synchronizing an MNI project, use **Go to Declaration** or **External Libraries** to view the implementation.

## Lockfiles and cached dependencies

After dependency declarations change, run `mcfpp install` to update locks. Run `mcfpp update` to select newer versions within declared ranges.

Prepare dependencies online before an offline build. `--offline` needs the required Gradle distribution and JVM dependencies in the local cache.
