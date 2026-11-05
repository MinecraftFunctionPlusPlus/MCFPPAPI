---
lastUpdated: true
---

# Gradle 与 Kotlin 构建

CLI 管理 MCFPP 构建，Gradle 编译并测试 MNI 的 Kotlin/JVM 源码。`mcfpp init demo --mni` 创建默认宏和 JUnit 测试。

| 路径 | 用途 |
| --- | --- |
| `mcfpp.toml` | 工程与 MNI 配置 |
| `mcfpp-packages.json` | MCFPP 与 JVM 依赖声明 |
| `src/main/kotlin` / `src/test/kotlin` | provider 与 Kotlin/JUnit 测试 |
| `src/main/java` / `src/test/java` | 可选的 Java 源码与测试 |
| `.mcfpp/gradle` | CLI 生成的 Gradle 工程 |
| `build/.mcfpp/mni` | MNI 构建输出 |

当前默认 Kotlin/JVM 插件为 2.4.10，JDK 和字节码目标为 21。IDEA 同步使用工程根目录的源码和生效后的依赖。

## 依赖与扩展

```sh
mcfpp add --mni org.apache.commons:commons-lang3:3.14.0
mcfpp build
mcfpp test
```

使用 `--configuration testImplementation` 添加测试依赖。自定义 Gradle 配置放在扩展脚本中，CLI 每次准备时会生成自己的 Gradle 文件。

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

## 锁文件与离线构建

```sh
mcfpp install
mcfpp build --locked --offline
```

`--locked` 使用有效锁文件；`--offline` 使用已缓存的 Gradle、Kotlin 插件和依赖。旧 MNI 工程迁移到 Kotlin 后，应重新 install 更新锁文件。`mcfpp test` 执行 Kotlin/Java 测试。

独立 provider JAR 使用宿主编译器 API 作为 compileOnly 依赖，由宿主提供编译器类与 Kotlin 运行库。
