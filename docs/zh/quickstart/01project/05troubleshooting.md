---
lastUpdated: true
---

# 处理构建问题

## 检查工具与工程

在 IDEA 的 **MCFPP** 工具窗口查看同步状态和 JDK。在终端中执行：

```sh
mcfpp --version
mcfpp --project ./hello build
```

Java MNI 使用 JDK 21。通过 `MCFPP_JAVA_HOME` 或 IDEA 设置选择它。源码错误可以从控制台链接跳转到对应行。

## 旧发行包缺少 Kotlin 反射库

IDEA 插件 0.5.2 及其配套 CLI 已修复 `KotlinReflectionNotSupportedError`：单 JAR 保留泛型 NBT 调用需要的 Kotlin 反射运行时。遇到此错误时，更新完整插件或配套 CLI，并检查 IDEA 的外部 CLI 设置是否仍指向旧 JAR。

## 查看编译器和 MNI 实现源码

IDEA 插件 0.5.2 随包携带 Java/Kotlin 实现源码和 MCFPP 标准库源码。同步 MNI 工程后，编译器依赖会自动附加源码；在 Java 代码中对 MCFPP API 执行转到声明，或从 External Libraries 中展开 MCFPP 源码库查看实现。普通 MCFPP 工程也可浏览该源码库。

MNI 工程使用本地 CLI JAR，因此 IDEA 的 Maven“下载源码”无法根据坐标解析它。插件内置源码可以直接查看，无需下载编译器仓库。独立 CLI 的完整发行目录还提供配套的 `*-sources.jar`。

## 锁文件与离线缓存

依赖声明改变后，运行 `mcfpp install` 更新锁。需要主动选择范围内的新版本时，运行 `mcfpp update`。

离线构建前，先联网完成一次依赖准备。`--offline` 同时要求本机已有所需 Gradle 版本和 Java 依赖。
