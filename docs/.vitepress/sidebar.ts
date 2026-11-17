import type { DefaultTheme } from 'vitepress';

type Entry = [string, string, string | [string, string]];
type Section = { text: [string, string]; collapsed: boolean; items: Entry[] };

// Each entry contains matching Chinese and English labels and canonical paths.
const sections: Section[] = [
    { text: ["开发流程", "Development workflow"], collapsed: false, items: [
        ["文档导航", "Documentation map", "quickstart/index"],
        ["创建工程", "Create a project", "quickstart/01project/01create-project"],
        ["IDEA 开发", "Develop in IDEA", "quickstart/01project/03idea"],
        ["工程配置", "Project configuration", "quickstart/01project/02config-file"],
        ["构建、产物与 IR", "Build, output, and IR", "quickstart/01project/04build-and-ir"],
        ["原版资源与入口", "Vanilla resources and entry points", "quickstart/01project/06vanilla-resources"],
        ["源码测试", "Source tests", "quickstart/01project/07source-tests"],
        ["Minecraft 版本", "Minecraft versions", "quickstart/minecraft-versions"],
        ["常见问题", "Troubleshooting", "quickstart/01project/05troubleshooting"],
    ] },
    { text: ["语言基础", "Language basics"], collapsed: true, items: [
        ["变量与类型", "Variables and types", "quickstart/02base/01variables"],
        ["数值转换与类型视图", "Number conversion and type views", "quickstart/advanced/conversions"],
        ["地址引用：ScoreRef 与 NBTRef", "Addresses: ScoreRef and NBTRef", "quickstart/02base/06references"],
        ["条件与循环", "Conditions and loops", "quickstart/02base/03logic-statements"],
        ["注释", "Comments", "quickstart/02base/02comments"],
        ["顶层语句", "Top-level statements", "quickstart/02base/04top-statements"],
        ["命名空间与导入", "Namespaces and imports", "quickstart/03namespace/01namespace"],
        ["原生命令与插值", "Commands and interpolation", "quickstart/02base/05original-command"],
    ] },
    { text: ["函数", "Functions"], collapsed: true, items: [
        ["定义与调用", "Define and call functions", "quickstart/04function/01define-and-call"],
        ["Lambda 与函数类型", "Lambdas and function types", "quickstart/04function/05lambda"],
        ["扩展函数与默认参数", "Extension functions and default arguments", "quickstart/advanced/functions"],
        ["参数传递", "Pass arguments", "quickstart/04function/02static-params"],
        ["内联函数", "Inline functions", "quickstart/04function/03inline-function"],
    ] },
    { text: ["泛型", "Generics"], collapsed: true, items: [
        ["泛型函数与类型参数", "Generic functions and type parameters", "quickstart/07generic/02generic_function"],
        ["泛型数据模板", "Generic data templates", "quickstart/07generic/03generic_class"],
        ["编译时参数与已知值", "Compilation parameters and known values", "quickstart/07generic/01concrete_var"],
        ["in 与 out：类型替换", "in and out: type substitution", "quickstart/advanced/variance"],
    ] },
    { text: ["集合与 NBT", "Collections and NBT"], collapsed: true, items: [
        ["NBT", "NBT", ["quickstart/05nbt/01nbt","quickstart/08nbt/01nbt"]],
        ["列表", "Lists", ["quickstart/05nbt/02list","quickstart/08nbt/02list"]],
        ["字典", "Dictionaries", ["quickstart/05nbt/03dict","quickstart/08nbt/03dict"]],
        ["Map", "Maps", ["quickstart/05nbt/04map","quickstart/08nbt/04map"]],
        ["集合回调：map、filter、fold", "Collection callbacks: map, filter, fold", "quickstart/advanced/collections"],
        ["只读列表、数组与范围", "Read-only lists, arrays, and ranges", "quickstart/advanced/containers"],
    ] },
    { text: ["数据模板", "Data templates"], collapsed: true, items: [
        ["定义与工厂", "Definitions and factories", ["quickstart/06template/01define","quickstart/09template/01define-and-instantiate"]],
        ["嵌套模板", "Nested templates", ["quickstart/06template/02template-nest","quickstart/09template/02template-nest"]],
        ["属性与运算符", "Properties and operators", "quickstart/advanced/members"],
        ["枚举", "Enumerations", "quickstart/advanced/enums"],
        ["可选访问与联合类型", "Optional access and union types", ["quickstart/06template/04sp-type","quickstart/09template/03sp-type"]],
        ["基础类型视图", "Views of base types", ["quickstart/06template/05type-as","quickstart/09template/04type-as"]],
        ["单例与伴随对象", "Singletons and companion objects", ["quickstart/06template/06object","quickstart/09template/05object"]],
        ["组合继承与结构类型", "Field inheritance and structural types", ["quickstart/06template/07inheritance","quickstart/09template/06inheritance"]],
    ] },
    { text: ["实体与 Minecraft", "Entities and Minecraft"], collapsed: true, items: [
        ["实体与执行上下文", "Entities and execution contexts", "quickstart/minecraft/entities"],
        ["标量数学", "Scalar math", "quickstart/minecraft/math"],
        ["读取分数、NBT 与命令结果", "Read scores, NBT, and command results", "quickstart/minecraft/read-results"],
        ["展示实体与调度", "Displays and scheduling", "quickstart/minecraft/displays"],
    ] },
    { text: ["依赖与库", "Dependencies and libraries"], collapsed: true, items: [
        ["添加与管理依赖", "Add and manage dependencies", ["quickstart/08library/01import-and-use","quickstart/10library/01import-and-use"]],
        ["导出库", "Export a library", ["quickstart/08library/02export-library","quickstart/10library/02export-library"]],
    ] },
    { text: ["Kotlin MNI 工程", "Kotlin MNI projects"], collapsed: true, items: [
        ["创建 Kotlin MNI 工程", "Create a Kotlin MNI project", ["quickstart/09mni/01mni-framework","quickstart/11mni/01mni-framework"]],
        ["参数与返回值", "Parameters and results", ["quickstart/09mni/02mni-framework-implementation","quickstart/11mni/02mni-framework-implementation"]],
        ["生成 Minecraft 命令", "Generate Minecraft commands", ["quickstart/09mni/05access","quickstart/11mni/05access"]],
        ["Gradle 与 Kotlin 测试", "Gradle and Kotlin tests", ["quickstart/10gradle/01gradle-configuration","quickstart/12gradle/01gradle-configuration"]],
    ] },
    { text: ["MNI 宏框架", "MNI macro framework"], collapsed: false, items: [
        ["宏入门与调用准备", "Macro introduction and setup", "quickstart/mni-macros/overview"],
        ["宏参数与生成变量", "Macro inputs and generated variables", "quickstart/mni-macros/parameters"],
        ["循环与回调", "Loops and callbacks", "quickstart/mni-macros/callbacks"],
        ["实体、位置与计分板", "Entities, positions, and scores", "quickstart/mni-macros/minecraft"],
        ["诊断、辅助函数与资源", "Diagnostics, helper functions, and resources", "quickstart/mni-macros/services"],
        ["模板处理器", "Template processors", "quickstart/mni-macros/declarations"],
    ] },
    { text: ["API 参考", "API reference"], collapsed: true, items: [
        ["API 导航", "API index", "api/index"],
        ["Kotlin DSL", "Kotlin DSL", "api/kotlin-dsl"],
        ["@MNIFunction", "@MNIFunction", "api/annotation/mnifunction"],
        ["@MNIMacro", "@MNIMacro", "api/annotation/mnimacro"],
        ["@MNIAccessor", "@MNIAccessor", "api/annotation/mniaccessor"],
        ["@MNIMutator", "@MNIMutator", "api/annotation/mnimutator"],
        ["@MNIMember", "@MNIMember", "api/annotation/mnimember"],
        ["@InsertCommand", "@InsertCommand", "api/annotation/insertcommand"],
        ["Command", "Command", "api/class/command"],
        ["文档注释", "Documentation comments", ["quickstart/11doc/01doc-comment","quickstart/13doc/01doc-comment"]],
    ] },
];

const examples: Section[] = [
    { text: ["MCFPP 示例", "MCFPP Examples"], collapsed: false, items: [
        ["运行示例", "Run the examples", "examples/"],
        ["01 · 范围、递归与浮点数", "01 · Ranges, recursion and floats", "examples/01-language-basics"],
        ["02 · 给坐标加上名字", "02 · Give a position a name", "examples/02-data-models"],
        ["03 · 用集合回调结算奖励", "03 · Calculate rewards with collection callbacks", "examples/03-functions-collections"],
        ["04 · 从聊天组件到计分板命令", "04 · From chat components to scoreboard commands", "examples/04-text-commands"],
        ["05 · 复制 NBT 地址", "05 · Copy an NBT address", "examples/05-score-nbt"],
        ["06 · 分别修改两个展示实体", "06 · Change one of two display entities", "examples/06-entities-context"],
        ["07 · 逐 tick 播放弹跳动画", "07 · Animate a bouncing display", "examples/07-display-animation"],
        ["08 · 让进度奖励调用 MCFPP", "08 · Call MCFPP from an advancement reward", "examples/08-vanilla-resources"],
        ["09 · 在递归调用中观察局部变量", "09 · Inspect locals during a recursive call", "examples/09-tests-debugger"],
        ["10 · 用 Kotlin 展开带回调的宏", "10 · Expand a callback macro with Kotlin", "examples/10-kotlin-mni"],
        ["11 · 沿着符号跨文件导航", "11 · Follow a symbol across files", "examples/11-editor-tour"],
    ] },
];

function navigation(locale: 'zh' | 'en', groups = sections): DefaultTheme.SidebarItem[] {
    const index = locale === 'zh' ? 0 : 1;
    return groups.map(section => ({
        text: section.text[index],
        collapsed: section.collapsed,
        items: section.items.map(([zh, en, path]) => ({
            text: index === 0 ? zh : en,
            link: `/${locale}/${Array.isArray(path) ? path[index] : path}`,
        })),
    }));
}

const zh = navigation('zh');
const en = navigation('en');

export const sidebar: DefaultTheme.Sidebar = {
    '/zh/quickstart/': zh,
    '/zh/api/': zh,
    '/zh/examples/': navigation('zh', examples),
    '/en/quickstart/': en,
    '/en/api/': en,
    '/en/examples/': navigation('en', examples),
};
