---
lastUpdated: true
prev: false
next:
  text: 创建工程
  link: /zh/quickstart/01project/01create-project
---

# 文档导航

从创建工程到生成数据包，可以按下面的开发流程阅读。左侧导航也按开发任务和语言功能分组。

## 完成一个工程

1. [创建工程](./01project/01create-project)：创建普通工程或 Kotlin MNI 工程。
2. [在 IDEA 中开发](./01project/03idea)：编辑、保存整理、同步依赖和运行任务。
3. [配置工程](./01project/02config-file)：选择 Minecraft 版本、目录和编译选项。
4. [管理依赖](./08library/01import-and-use)：添加库并使用锁文件。
5. [构建与检查 IR](./01project/04build-and-ir)：找到数据包，追踪代码如何编译。

## 查找语言功能

| 想做的事 | 阅读 |
| --- | --- |
| 定义变量、常量和类型别名 | [变量与类型](./02base/01variables) |
| 转换数值，理解 `as` 与赋值 | [数值转换与类型视图](./advanced/conversions) |
| 定义函数、默认参数和扩展语法 | [函数](./04function/01define-and-call)、[默认参数与扩展函数](./advanced/functions) |
| 使用回调、隐式 `it` 和尾随 Lambda | [Lambda 与函数类型](./04function/05lambda) |
| 批量计算、筛选和累计 | [集合回调](./advanced/collections) |
| 使用只读列表、NBT 数组和整数范围 | [容器与范围](./advanced/containers) |
| 读写游戏中的计分板和 NBT | [ScoreRef 与 NBTRef](./02base/06references) |
| 选择实体、切换身份和位置、访问乘客 | [实体与上下文](./minecraft/entities) |
| 区分缺失数据和零，读取命令结果 | [读取结果](./minecraft/read-results) |
| 定义结构化数据和构造函数 | [数据模板](./06template/01define) |
| 设置属性读写逻辑 | [属性与运算符](./advanced/members) |
| 为固定选项命名 | [枚举](./advanced/enums) |
| 复用单例状态和类型相关功能 | [单例与伴随对象](./06template/06object) |
| 继承、抽象方法和多个父模板 | [继承与抽象](./06template/07inheritance) |
| 编写能处理多种类型的函数 | [泛型函数与类型参数](./07generic/02generic_function) |
| 为对象选择字段类型 | [泛型数据模板](./07generic/03generic_class) |
| 为函数与模板提供固定数值配置 | [编译时参数与已知值](./07generic/01concrete_var) |
| 声明泛型参数的数据方向 | [in 与 out](./advanced/variance) |
| 为多个 Minecraft 版本生成代码 | [版本条件](./minecraft-versions) |

## 学习 MNI

从完整工程开始，按下面的顺序阅读：

1. [Kotlin MNI 入门](./09mni/01mni-framework)：创建 Kotlin 工程，声明并调用宏。
2. [参数与返回值](./09mni/02mni-framework-implementation)：接收普通参数和编译时参数，返回 MCFPP 值。
3. [生成命令](./09mni/05access)：让 Kotlin 原生入口生成游戏中执行的操作。
4. [Gradle 与 Kotlin 测试](./10gradle/01gradle-configuration)：配置依赖和测试。

编写需要组合表达式、循环或用户回调的库时，继续阅读 [MNI 宏入门](./mni-macros/overview)。宏教程从调用准备开始，再依次介绍参数、回调、Minecraft 操作和模板处理器。

注解字段与入口签名见 [API 参考](/zh/api/index)。工具配置和同步问题见[常见问题](./01project/05troubleshooting)。
