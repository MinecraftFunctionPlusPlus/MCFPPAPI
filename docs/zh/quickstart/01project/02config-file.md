---
lastUpdated: true
---

# 配置文件

MCFPP的工程配置文件是一个json文件，一般存放在这个工程的根目录下。它的Json格式如下：

```json
{
    //编译的目标Minecraft版本。仅支持正式版版本号
    "version": "1.21.4", 
    //项目的源代码目录。文件的命名空间根据文件相对于源代码目录的相对路径决定
    "sourcePath": "src/main/mcfpp/**",
    //数据包的描述。是一个原始JSON文本
    "description": "",
    //数据包的默认命名空间，将会决定数据包中storage等数据的命名空间
    "rootNamespace": "test",
    //数据包的输出路径。数据包、库文件将会输出在此目录下
    "targetPath": "src/main/resources/lib",
    //是否 *不* 生成数据包。默认为false
    "noDatapack": false,
    //是否 *忽略* 标准库。默认为false。如果为true，将不会引用mcfpp的标准库。 
    "ignoreStdLib": false,
    //是否是库。默认为false。库不需要拥有一个入口函数
    "isLib": false,
    //生成注释的级别
    "commentLevel": "debug"
}
```
