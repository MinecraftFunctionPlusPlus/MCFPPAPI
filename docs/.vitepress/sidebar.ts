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
        ["定义与构造", "Definitions and constructors", ["quickstart/06template/01define","quickstart/09template/01define-and-instantiate"]],
        ["嵌套模板", "Nested templates", ["quickstart/06template/02template-nest","quickstart/09template/02template-nest"]],
        ["属性与运算符", "Properties and operators", "quickstart/advanced/members"],
        ["枚举", "Enumerations", "quickstart/advanced/enums"],
        ["可空类型与联合类型", "Nullable and union types", ["quickstart/06template/04sp-type","quickstart/09template/03sp-type"]],
        ["基础类型视图", "Views of base types", ["quickstart/06template/05type-as","quickstart/09template/04type-as"]],
        ["单例与伴随对象", "Singletons and companion objects", ["quickstart/06template/06object","quickstart/09template/05object"]],
        ["继承与抽象", "Inheritance and abstract templates", ["quickstart/06template/07inheritance","quickstart/09template/06inheritance"]],
    ] },
    { text: ["实体与 Minecraft", "Entities and Minecraft"], collapsed: true, items: [
        ["实体与执行上下文", "Entities and execution contexts", "quickstart/minecraft/entities"],
        ["读取分数、NBT 与命令结果", "Read scores, NBT, and command results", "quickstart/minecraft/read-results"],
    ] },
    { text: ["依赖与库", "Dependencies and libraries"], collapsed: true, items: [
        ["添加与管理依赖", "Add and manage dependencies", ["quickstart/08library/01import-and-use","quickstart/10library/01import-and-use"]],
        ["导出库", "Export a library", ["quickstart/08library/02export-library","quickstart/10library/02export-library"]],
    ] },
    { text: ["MNI 函数与 Java", "MNI functions and Java"], collapsed: true, items: [
        ["创建 Java MNI 工程", "Create a Java MNI project", ["quickstart/09mni/01mni-framework","quickstart/11mni/01mni-framework"]],
        ["参数与返回值", "Parameters and results", ["quickstart/09mni/02mni-framework-implementation","quickstart/11mni/02mni-framework-implementation"]],
        ["生成 Minecraft 命令", "Generate Minecraft commands", ["quickstart/09mni/05access","quickstart/11mni/05access"]],
        ["Gradle 与 Java 测试", "Gradle and Java tests", ["quickstart/10gradle/01gradle-configuration","quickstart/12gradle/01gradle-configuration"]],
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

function navigation(locale: 'zh' | 'en'): DefaultTheme.SidebarItem[] {
    const index = locale === 'zh' ? 0 : 1;
    return sections.map(section => ({
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
    '/en/quickstart/': en,
    '/en/api/': en,
};
