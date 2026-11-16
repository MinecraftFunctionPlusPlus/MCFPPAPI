---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
lastUpdated: true

hero:
  name: "MCFPP"
  text: "Typed. Cross-Version. Vanilla."
  image:
    src: /logo-dark.svg
    alt: MCFPP
  actions:
    - theme: brand
      text: Get started
      link: /en/quickstart/index
    - theme: alt
      text: Playground
      link: /en/playground

features:
  - title: Structured Syntax
    details: Familiar C-like and object-oriented syntax with type checking, generics, and lambdas instead of raw command sprawl.
  - title: Cross-Version Builds
    details: Target 1.21 through 26.3+ from one codebase with #if version directives and automatic backend adaptation.
  - title: Native MNI & O2
    details: Compile to clean vanilla .mcfunction packs optimized by an O2 pass pipeline, and bind Kotlin macros seamlessly.
---
