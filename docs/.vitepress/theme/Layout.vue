<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import DefaultTheme from "vitepress/theme";

const { lang, site } = useData();
const playgroundLink = computed(() => {
  const locale = lang.value.startsWith("zh") ? "zh" : "en";
  const extension = site.value.cleanUrls ? "" : ".html";
  return withBase(`/${locale}/playground${extension}`);
});
</script>

<template>
  <DefaultTheme.Layout>
    <template #sidebar-nav-before>
      <!-- 入口沿用站内路由，同时保持文档列表的阅读顺序。 -->
      <a class="playground-link" :href="playgroundLink"> Playground </a>
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.playground-link {
  display: block;
  margin-bottom: 16px;
  padding: 12px 0 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
}

.playground-link:hover,
.playground-link:focus-visible {
  color: var(--vp-c-brand-1);
}
</style>
