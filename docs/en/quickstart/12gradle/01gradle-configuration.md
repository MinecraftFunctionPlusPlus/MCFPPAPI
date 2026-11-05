---
lastUpdated: true
---

# Gradle and Kotlin builds

The CLI manages MCFPP builds; Gradle compiles and tests MNI Kotlin/JVM sources. `mcfpp init demo --mni` creates a default macro and JUnit test.

| Path | Purpose |
| --- | --- |
| `mcfpp.toml` | Project and MNI configuration |
| `mcfpp-packages.json` | MCFPP and JVM dependencies |
| `src/main/kotlin` / `src/test/kotlin` | Providers and Kotlin/JUnit tests |
| `src/main/java` / `src/test/java` | Optional Java sources and tests |
| `.mcfpp/gradle` | Generated Gradle project |
| `build/.mcfpp/mni` | MNI build output |

The current default Kotlin/JVM plugin is 2.4.10. The JDK and bytecode target are 21. IDEA synchronization uses the project-root source directories and resolved dependencies.

## Dependencies and extensions

```sh
mcfpp add --mni org.apache.commons:commons-lang3:3.14.0
mcfpp build
mcfpp test
```

Use `--configuration testImplementation` for test dependencies. Put custom Gradle configuration in extension scripts; the CLI regenerates its own Gradle files.

```toml
[mni]
enabled = true
repositories = ["https://repo.maven.apache.org/maven2/"]
extensions = ["mni.gradle.kts"]
```

`mni.gradle.kts`:

```kotlin
tasks.withType<Test>().configureEach {
    testLogging {
        events("passed", "failed", "skipped")
    }
}
```

## Locks and offline builds

```sh
mcfpp install
mcfpp build --locked --offline
```

`--locked` uses a valid lockfile; `--offline` uses cached Gradle, Kotlin plugins, and dependencies. Run install again when migrating an older MNI project to Kotlin. `mcfpp test` runs Kotlin and Java tests.

A standalone provider JAR uses the host compiler API as a compileOnly dependency. The host supplies compiler classes and the Kotlin runtime.
