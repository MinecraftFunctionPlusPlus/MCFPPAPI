import { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = {
    "/zh/quickstart/": [
        {
            text: "工程配置",
            "items": [
                {
                    text: "创建工程",
                    link: "/zh/quickstart/01project/01create-project",
                },
                {
                    text: "配置文件",
                    link: "/zh/quickstart/01project/02config-file",
                }
            ],
        },
        {
            text: "基本语法",
            "items": [
                {
                    text: "变量",
                    link: "/zh/quickstart/02base/01variables",
                },
                {
                    text: "注释",
                    link: "/zh/quickstart/02base/02comments",
                },
                {
                    text: "逻辑语句",
                    link: "/zh/quickstart/02base/03logic-statements",
                },
                {
                    text: "顶层语句*",
                    link: "/zh/quickstart/02base/04top-statements",
                },
                {
                    text: "原生命令",
                    link: "/zh/quickstart/02base/05original-command",
                }
            ],
        },
        {
            text: "命名空间",
            "items": [
                {
                    text: "命名空间",
                    link: "/zh/quickstart/03namespace/01namespace",
                }
            ],
        },
        {
            text: "函数",
            "items": [
                {
                    text: "定义和调用",
                    link: "/zh/quickstart/04function/01define-and-call",
                },
                {
                    text: "static关键字*",
                    link: "/zh/quickstart/04function/02static-params",
                },
                {
                    text: "内联函数",
                    link: "/zh/quickstart/04function/03inline-function",
                },
                {
                    text: "编译期函数",
                    link: "/zh/quickstart/04function/04compiletime-function",
                }
            ],
        },
        {
            text: "类",
            "items": [
                {
                    text: "实体模板",
                    link: "/zh/quickstart/05class/01define-and-instantiate",
                },
                {
                    text: "实体模板的成员",
                    link: "/zh/quickstart/05class/02member",
                },
                {
                    text: "单例",
                    link: "/zh/quickstart/05class/03object",
                },
                {
                    text: "继承和抽象",
                    link: "/zh/quickstart/05class/04inheritance-abstract",
                },
                {
                    text: "杂项",
                    link: "/zh/quickstart/05class/05miscellaneous",
                }
            ],
        },
        {
            text: "接口",
            "items": [
                {
                    text: "定义和实现接口",
                    link: "/zh/quickstart/06interface/01define-and-implement",
                }
            ],
        },
        {
            text: "泛型",
            "items": [
                {
                    text: "编译确定量",
                    link: "/zh/quickstart/07generic/01concrete_var",
                },
                {
                    text: "泛型函数",
                    link: "/zh/quickstart/07generic/02generic_function",
                },
                {
                    text: "泛型类",
                    link: "/zh/quickstart/07generic/03generic_class",
                }
            ],
        },
        {
            text: "NBT数据",
            "items": [
                {
                    text: "NBT",
                    link: "/zh/quickstart/08nbt/01nbt",
                },
                {
                    text: "列表",
                    link: "/zh/quickstart/08nbt/02list",
                },
                {
                    text: "字典",
                    link: "/zh/quickstart/08nbt/03dict",
                },
                {
                    text: "MAP",
                    link: "/zh/quickstart/08nbt/04map",
                }
            ],
        },
        {
            text: "模板",
            "items": [
                {
                    text: "数据模板",
                    link: "/zh/quickstart/09template/01define-and-instantiate",
                },
                {
                    text: "数据模板的嵌套",
                    link: "/zh/quickstart/09template/02template-nest",
                },
                {
                    text: "特殊类型",
                    link: "/zh/quickstart/09template/03mort-type",
                },
                {
                    text: "类型委托",
                    link: "/zh/quickstart/09template/04type-as",
                },
            ],
        },
        {
            text: "库",
            "items": [
                {
                    text: "库的导入和使用",
                    link: "/zh/quickstart/10library/01import-and-use",
                },
                {
                    text: "库的导出",
                    link: "/zh/quickstart/10library/02export-library",
                }
            ],
        },
        {
            text: "MNI框架",
            "items": [
                {
                    text: "MNI框架",
                    link: "/zh/quickstart/11mni/01mni-framework",
                },
                {
                    text: "MNI函数",
                    link: "/zh/quickstart/11mni/02mni-framework-implementation",
                },
                {
                    text: "JavaVar",
                    link: "/zh/quickstart/11mni/03javavar",
                },
                {
                    text: "注解*",
                    link: "/zh/quickstart/11mni/04annotation",
                },
                {
                    text: "JVM访问符",
                    link: "/zh/quickstart/11mni/05access",
                }
            ],
        },
        {
            text: "Gradle构建",
            "items": [
                {
                    text: "Gradle的配置",
                    link: "/zh/quickstart/12gradle/01gradle-configuration",
                }
            ],
        }
    ],
    "/en/quickstart/": [
        {
            text: "Project Configuration",
            "items": [
                {
                    text: "Create a Project",
                    link: "/en/quickstart/01project/01create-project",
                },
                {
                    text: "Configuration File",
                    link: "/en/quickstart/01project/02config-file",
                }
            ],
        },
        {
            text: "Basic Syntax",
            "items": [
                {
                    text: "Variable",
                    link: "/en/quickstart/02base/01variables",
                },
                {
                    text: "Comments",
                    link: "/en/quickstart/02base/02comments",
                },
                {
                    text: "Logic statements",
                    link: "/en/quickstart/02base/03logic-statements",
                },
                {
                    text: "Top statement*",
                    link: "/en/quickstart/02base/04top-statements",
                },
                {
                    text: "Native Commands",
                    link: "/en/quickstart/02base/05original-command",
                }
            ],
        },
        {
            text: "Namespace",
            "items": [
                {
                    text: "Namespace",
                    link: "/en/quickstart/03namespace/01namespace",
                }
            ],
        },
        {
            text: "Function",
            "items": [
                {
                    text: "Define and call",
                    link: "/en/quickstart/04function/01define-and-call",
                },
                {
                    text: "static keyword*",
                    link: "/en/quickstart/04function/02static-params",
                },
                {
                    text: "Inline function",
                    link: "/en/quickstart/04function/03inline-function",
                },
                {
                    text: "Compile-time Function",
                    link: "/en/quickstart/04function/04compiletime-function",
                }
            ],
        },
        {
            text: "Class",
            "items": [
                {
                    text: "Entity Template",
                    link: "/en/quickstart/05class/01define-and-instantiate",
                },
                {
                    text: "Member of entity template",
                    link: "/en/quickstart/05class/02member",
                },
                {
                    text: "Singleton",
                    link: "/en/quickstart/05class/03object",
                },
                {
                    text: "Inheritance and abstraction",
                    link: "/en/quickstart/05class/04inheritance-abstract",
                }
            ],
        },
        {
            text: "Interface",
            "items": [
                {
                    text: "Define and implement",
                    link: "/en/quickstart/06interface/01define-and-implement",
                }
            ],
        },
        {
            text: "Generic",
            "items": [
                {
                    text: "Compile-time Constants",
                    link: "/en/quickstart/07generic/01concrete_var",
                },
                {
                    text: "Generic Functions",
                    link: "/en/quickstart/07generic/02generic_function",
                },
                {
                    text: "Generic Classes",
                    link: "/en/quickstart/07generic/03generic_class",
                }
            ],
        },
        {
            text: "NBT Data",
            "items": [
                {
                    text: "NBT",
                    link: "/en/quickstart/08nbt/01nbt",
                },
                {
                    text: "Lists",
                    link: "/en/quickstart/08nbt/02list",
                },
                {
                    text: "Dictionary",
                    link: "/en/quickstart/08nbt/03dict",
                },
                {
                    text: "MAP",
                    link: "/en/quickstart/08nbt/04map",
                }
            ],
        },
        {
            text: "Data Template",
            "items": [
                {
                    text: "Data Template",
                    link: "/en/quickstart/09template/01define-and-instantiate",
                },
                {
                    text: "Nested Data Templates",
                    link: "/en/quickstart/09template/02template-nest",
                },
                {
                    text: "Special Types in Data Templates",
                    link: "/en/quickstart/09template/03mort-type",
                }
            ],
        },
        {
            text: "Library",
            "items": [
                {
                    text: "Import and Use",
                    link: "/en/quickstart/10library/01import-and-use",
                },
                {
                    text: "Export Library",
                    link: "/en/quickstart/10library/02export-library",
                }
            ],
        },
        {
            text: "MNI Framework",
            "items": [
                {
                    text: "MNI Framework",
                    link: "/en/quickstart/11mni/01mni-framework",
                },
                {
                    text: "MNI Functions",
                    link: "/en/quickstart/11mni/02mni-framework-implementation",
                },
                {
                    text: "JavaVar",
                    link: "/en/quickstart/11mni/03javavar",
                },
                {
                    text: "Annotations*",
                    link: "/en/quickstart/11mni/04annotation",
                },
                {
                    text: "JVM Access Operator",
                    link: "/en/quickstart/11mni/05access",
                }
            ],
        },
        {
            text: "Gradle Build",
            "items": [
                {
                    text: "Gradle Configuration",
                    link: "/en/quickstart/12gradle/01gradle-configuration",
                }
            ],
        }
    ],
};
