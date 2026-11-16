<script setup lang="ts">
import { computed } from "vue";
import { useData, withBase } from "vitepress";
import DefaultTheme from "vitepress/theme";
import ApiHover from "../components/api-hover/ApiHover.vue";
import HomeCodeShowcase from "./HomeCodeShowcase.vue";

const { lang, site } = useData();
const isZh = computed(() => lang.value.startsWith("zh"));
const localePrefix = computed(() => (isZh.value ? "zh" : "en"));

const makeLink = (path: string) => {
  const extension = site.value.cleanUrls ? "" : ".html";
  return withBase(`/${localePrefix.value}${path}${extension}`);
};

const playgroundLink = computed(() => makeLink("/playground"));
</script>

<template>
  <DefaultTheme.Layout>
    <template #sidebar-nav-before>
      <!-- 入口沿用站内路由，同时保持文档列表的阅读顺序。 -->
      <a class="playground-link" :href="playgroundLink"> Playground </a>
    </template>

    <template #home-hero-before>
      <!-- 左侧深底纯净留白，右侧铺陈淡化原版命令代码与 45° 层叠背景烘托玻璃折射 -->
      <div class="mcfpp-hero-backdrop" aria-hidden="true">
        <div class="mcfpp-stage-plane mcfpp-plane-1"></div>
        <div class="mcfpp-stage-plane mcfpp-plane-2"></div>
        <div class="mcfpp-stage-plane mcfpp-plane-3"></div>
        <div class="mcfpp-stage-glow"></div>
        <pre class="mcfpp-bg-code"><code><span class="bg-kw">import</span> mcfpp.lang:*

<span class="bg-kw">data</span> <span class="bg-ty">PlayerStats</span> {
    <span class="bg-kw">var</span> score: <span class="bg-ty">int</span> = <span class="bg-num">10</span>
    <span class="bg-kw">func</span> <span class="bg-fn">bonus</span>(): <span class="bg-ty">int</span> { <span class="bg-kw">return</span> <span class="bg-kw">this</span>.score * <span class="bg-num">2</span> }
}

<span class="bg-dir">#if</span> <span class="bg-ty">MC</span> &gt;= <span class="bg-num">26.1</span>
<span class="bg-kw">func</span> <span class="bg-fn">announce</span>(name: <span class="bg-ty">string</span>) {
    <span class="bg-cmd-root">/execute</span> <span class="bg-sub">as</span> <span class="bg-sel">@a</span> <span class="bg-sub">run</span> <span class="bg-cmd-root">say</span> <span class="bg-str">Welcome</span> <span class="bg-dir">${</span>name<span class="bg-dir">}</span><span class="bg-str">!</span>
    <span class="bg-cmd-root">/particle</span> <span class="bg-res">minecraft:end_rod</span> <span class="bg-num">~ ~1 ~ 0.3 0.5 0.3 0.02 12</span>
    <span class="bg-sel">@s</span>.<span class="bg-fn">withEntityCtx</span> { actor -&gt;
        <span class="bg-cmd-root">/say</span> <span class="bg-str">Syncing datapack state...</span>
        <span class="bg-cmd-root">/playsound</span> <span class="bg-res">minecraft:entity.player.levelup</span> <span class="bg-sub">master</span> <span class="bg-sel">@s</span>
    }
}
<span class="bg-dir">#endif</span>

<span class="bg-kw">func</span> <span class="bg-fn">main</span>() {
    <span class="bg-kw">var</span> stats = <span class="bg-ty">PlayerStats</span>()
    <span class="bg-kw">var</span> transform: (<span class="bg-ty">int</span>) -&gt; <span class="bg-ty">int</span> = { it + <span class="bg-num">5</span> }
    <span class="bg-fn">announce</span>(<span class="bg-str">"MCFPP"</span>)
    <span class="bg-cmd-root">/scoreboard</span> <span class="bg-sub">objectives add</span> mcfpp <span class="bg-ty">dummy</span>
    <span class="bg-fn">print</span>(transform(stats.bonus()))
}</code></pre>
      </div>
    </template>

    <template #home-hero-info-after>
      <div class="mcfpp-mc-badge">
        <svg class="mcfpp-grass-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
          <!-- 像素草方块图标：草顶与侧沿垂落像素 + 泥土底色 -->
          <rect x="0" y="0" width="16" height="16" fill="#7c563b" />
          <rect x="2" y="8" width="2" height="2" fill="#63422b" />
          <rect x="11" y="7" width="3" height="2" fill="#63422b" />
          <rect x="5" y="12" width="3" height="2" fill="#63422b" />
          <rect x="12" y="12" width="2" height="2" fill="#8f684b" />
          <rect x="1" y="11" width="2" height="2" fill="#8f684b" />
          <rect x="0" y="0" width="16" height="4" fill="#58ab45" />
          <rect x="0" y="0" width="16" height="2" fill="#6bc256" />
          <rect x="2" y="4" width="3" height="2" fill="#58ab45" />
          <rect x="8" y="4" width="2" height="3" fill="#469136" />
          <rect x="12" y="4" width="3" height="2" fill="#58ab45" />
        </svg>
        <span class="mcfpp-mc-badge-text">
          For <strong>Minecraft Java Edition</strong>
        </span>
      </div>
    </template>

    <template #home-hero-image>
      <div class="mcfpp-hero-stage" aria-hidden="true">
        <div class="mcfpp-hero-glass-plate"></div>
        <!-- 首页大 Logo 专用的同心 viewBox 与反向旋转 45° 对齐缺口的橙色加号 -->
        <svg
          class="mcfpp-hero-logo"
          viewBox="4.5 13.5 104 104"
          role="img"
          aria-label="MCFPP"
        >
          <polygon points="22,25 39,25 39,48 16,48 16,31" fill="#8A6CE8" />
          <rect x="45" y="25" width="23" height="23" rx="2.5" fill="#37AD8D" />
          <rect x="16" y="54" width="23" height="23" rx="2.5" fill="#37AD8D" />
          <rect x="45" y="54" width="23" height="23" rx="2.5" fill="#EB9E1A" />
          <rect x="74" y="54" width="23" height="23" rx="2.5" fill="#37AD8D" />
          <polygon points="16,83 39,83 39,106 22,106 16,100" fill="#8A6CE8" />
          <rect x="45" y="83" width="23" height="23" rx="2.5" fill="#37AD8D" />
          <polygon points="74,83 97,83 97,100 91,106 74,106" fill="#8A6CE8" />
          <g transform="rotate(-45 85.33 36.67)">
            <rect x="81.33" y="25.17" width="8" height="23" rx="1.8" fill="#F57636" />
            <rect x="73.83" y="32.67" width="23" height="8" rx="1.8" fill="#F57636" />
          </g>
        </svg>
      </div>
    </template>

    <template #home-features-before>
      <div class="mcfpp-section-head">
        <div class="mcfpp-section-head-inner">
          <h2 class="mcfpp-section-title">
            {{ isZh ? "为什么选择 MCFPP？" : "Why MCFPP?" }}
          </h2>
        </div>
      </div>
      <!-- 第二屏紧接导语先放代码示例，随后再放特性小卡片 -->
      <HomeCodeShowcase />
    </template>
  </DefaultTheme.Layout>
  <ApiHover />
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
