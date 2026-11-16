---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
lastUpdated: true

hero:
  name: "MCFPP"
  text: "强类型 · 跨版本 · 香草"
  image:
    src: /logo-dark.svg
    alt: MCFPP
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/quickstart/index
    - theme: alt
      text: 在线试用
      link: /zh/playground

features:
  - title: 结构化现代语法
    details: 提供数据模板、强类型检查、泛型与 Lambda，告别手写海量零散 mcfunction 文件。
  - title: 跨版本统一编译
    details: 通过 #if 版本条件指令与标准库后端适配，一份工程即可针对 1.21 至 26.3+ 输出数据包。
  - title: 原生优化与 MNI
    details: 默认经由 O2 Pass 流水线折叠常数与内联，输出干净的原版数据包，并支持 Kotlin MNI 编译期扩展。
---
