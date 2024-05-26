export * from './sidebar'

import { DefaultTheme } from 'vitepress';

export const sidebar : DefaultTheme.Sidebar = {
    "/zh/quickstart/":[
        {
            text: "工程配置",
            items: [
                { text: "创建工程", link: "/zh/quickstart/01project/01create-project" },
                { text: "配置文件", link: "/zh/quickstart/01project/02config-file" }
            ]
        },
        {
            text: "基本语法",
            items: [
                { text: "变量", link: "/zh/quickstart/02base/01variables" },
                { text: "注释", link: "/zh/quickstart/02base/02comments" },
                { text: "逻辑语句", link: "/zh/quickstart/02base/03logic-statements" },
                { text: "顶层语句", link: "/zh/quickstart/02base/04top-statements" }
            ]
        },
        {
            text: "全局变量和命名空间",
            items: [
                { text: "命名空间", link: "/zh/quickstart/03namespace/01namespace" }
            ]
        },
        {
            text: "函数",
            items: [
                { text: "定义和调用", link: "/zh/quickstart/04function/01define-and-call" },
                { text: "static关键字", link: "/zh/quickstart/04function/02static-params" },
                { text: "内联函数", link: "/zh/quickstart/04function/03inline-function" },
                { text: "编译时函数", link: "/zh/quickstart/04function/04compiletime-function" }
            ]   
        },
        {
            text: "类",
            items: [
                { text: "定义和实例化", link: "/zh/quickstart/05class/01define-and-instantiate" },
                { text: "成员变量", link: "/zh/quickstart/05class/02member" },
                { text: "继承和多态", link: "/zh/quickstart/05class/03inheritance-abstract" }
            ]
        },
        {
            text: "接口",
            items: [
                { text: "定义和实现", link: "/zh/quickstart/06interface/01define-and-implement" }
            ]
        },
        {
            text: "泛型",
            items: [
            ]
        },
        {
            text: "模板",
            items: [
                { text: "定义和实例化", link: "/zh/quickstart/08template/01define-and-instantiate" },
                { text: "模板参数", link: "/zh/quickstart/08template/02template-parameters" }
            ]
        },
        {
            text: "库",
            items: [
                { text: "导入和调用", link: "/zh/quickstart/09library/01import-and-use" },
                { text: "库的导出", link: "/zh/quickstart/09library/02export-library" }
            ]
        },
        {   
            text: "MNI框架",
            items: [
                { text: "介绍", link: "/zh/quickstart/10mni/01mni-framework" },
                { text: "MNI框架的实现", link: "/zh/quickstart/10mni/02mni-framework-implementation" },
                { text: "直接使用java变量和函数", link: "/zh/quickstart/10mni/03javavar" },
            ]
        },
        {
            text: "使用Gradle开发",
            items: [
                { text: "Gradle配置和使用", link: "/zh/quickstart/11gradle/01gradle-configuration" }
            ]
        }
    ]
}
