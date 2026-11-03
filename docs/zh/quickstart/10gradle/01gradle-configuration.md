---
lastUpdated: true
---

# Gradle 与 Java 构建

CLI 负责整个 MCFPP 构建，Gradle 负责 MNI 的 Java 依赖、编译和测试。`mcfpp init demo --mni` 会生成所需的用户配置。

## 文件归属

| 文件或目录 | 作用 |
| --- | --- |
| `mcfpp.toml` | 工程和 MNI 配置 |
| `mcfpp-packages.json` | MCFPP 与 Java 依赖声明 |
| `src/main/java` | MNI 实现 |
| `src/test/java` | JUnit 测试 |
| `.mcfpp/gradle` | CLI 生成的 Gradle 工程 |
| `build/.mcfpp/mni` | Java 构建输出 |

CLI 在每次准备 MNI 时生成 Gradle 文件。将自定义配置放在工程自己的扩展脚本中。

## 添加 Java 依赖

以下坐标来自一个公开的 Java 库：

```sh
mcfpp add --mni org.apache.commons:commons-lang3:3.14.0
mcfpp build
mcfpp test
```

测试依赖可以指定 configuration：

```sh
mcfpp add --mni org.junit.jupiter:junit-jupiter:5.10.1 --configuration testImplementation
```

## 配置扩展脚本

`mcfpp.toml`：

```toml
[mni]
enabled = true
repositories = ["https://repo.maven.apache.org/maven2/"]
extensions = ["mni.gradle.kts"]
```

工程根目录的 `mni.gradle.kts`：

```kotlin
tasks.withType<JavaCompile>().configureEach {
    options.encoding = "UTF-8"
}

tasks.withType<Test>().configureEach {
    testLogging {
        events("passed", "failed", "skipped")
    }
}
```

额外 Gradle 插件在 `[mni.plugins]` 中按插件 ID 与版本声明。IDEA 同步读取扩展生效后的 Java 源码目录和依赖。

## JDK 与可重复构建

MNI 构建使用 JDK 21。CLI 按 `MCFPP_JAVA_HOME`、`JDK21_HOME`、`JAVA_HOME` 和当前 Java 安装的顺序寻找 JDK。

先执行一次联网安装，再使用缓存构建：

```sh
mcfpp install
mcfpp build --locked --offline
```

`--locked` 使用已有有效锁文件。`--offline` 使用本机已缓存的 Gradle 和依赖。`mcfpp test` 执行 Java 测试，`src/test/mcfpp` 是预留的源码测试目录。
