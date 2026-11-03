---
lastUpdated: true
---

# 管理依赖与使用库

`mcfpp-packages.json` 保存工程依赖。MCFPP 库使用 `group:name` 和版本范围，Java 库使用 Maven 坐标。

## 添加与移除依赖

以下 MCFPP 坐标是格式示例。将它替换为仓库中实际发布的库：

```sh
mcfpp add 'example:utils@^1.0.0'
mcfpp remove example:utils
```

Java MNI 依赖使用 `--mni`。这个例子添加 Apache Commons Lang：

```sh
mcfpp add --mni org.apache.commons:commons-lang3:3.14.0
mcfpp remove --mni org.apache.commons:commons-lang3
```

添加 Java 依赖会启用工程的 MNI 构建。依赖声明格式如下：

```json
{
  "schema": 1,
  "mni": [
    "org.apache.commons:commons-lang3:3.14.0"
  ],
  "mcfpp": {
    "example:utils": "^1.0.0"
  }
}
```

`schema` 为 `1`。`mni` 列出 Java 依赖，`mcfpp` 保存 MCFPP 坐标与版本范围。依赖成功准备后，CLI 更新声明与锁文件。

## 安装、更新和离线构建

```sh
mcfpp install
mcfpp build --locked
mcfpp build --locked --offline
mcfpp update
```

`install` 准备依赖。`build` 和 `test` 也会自动准备依赖。已有有效锁文件会保留选定的版本。`update` 在声明允许的范围内重新选择版本。

`--locked` 要求有效锁文件，并保持其内容。`--offline` 使用已缓存的依赖和工具。将锁文件提交到版本库，方便其他开发者使用相同版本。

## 在源码中使用库

安装处理“从哪里取得库”，`import` 处理“使用哪个命名空间”。具体名称由库声明决定。

```text
import example.utils:*

func main() {
    print(formatScore(10))
}
```

上面展示一个假设库的调用方式。实际函数名称、参数和命名空间以该库文档为准。工程内多个文件的完整示例见[命名空间](../03namespace/01namespace)。

IDEA 中可使用 **Add…**、**Remove** 和 **Synchronize**。同步后，编辑器与 CLI 使用同一份已解析依赖。
