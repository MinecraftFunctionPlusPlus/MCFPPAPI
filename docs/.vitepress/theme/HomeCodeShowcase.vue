<script setup lang="ts">
import { computed, ref } from "vue";
import { useData, withBase } from "vitepress";

const { lang, site } = useData();
const isZh = computed(() => lang.value.startsWith("zh"));
const localePrefix = computed(() => (isZh.value ? "zh" : "en"));

const makeLink = (path: string) => {
  const extension = site.value.cleanUrls ? "" : ".html";
  return withBase(`/${localePrefix.value}${path}${extension}`);
};

const activeIndex = ref(0);
const copied = ref(false);

const examples = computed(() => [
  {
    id: "structure",
    tab: isZh.value ? "数据结构与 Lambda" : "Structure & Lambdas",
    file: "src/main.mcfpp",
    badge: "O2 Pipeline",
    summary: isZh.value
      ? "面向对象数据模板、函数类型与尾随 Lambda，在编译期经由 O2 常量折叠。"
      : "Object-oriented data templates, function types, and lambdas folded at compile time.",
    docLink: makeLink("/overview"),
    docLabel: isZh.value ? "阅读语法总览 →" : "Read Syntax Overview →",
    rawCode: `data Reward {
    var amount: int = 10
}

func doubled(value: int): int {
    return value * 2
}

func main() {
    var reward = Reward()
    var transform: (int) -> int = { it + 5 }
    print(doubled(transform(reward.amount)))
}`,
    highlighted: [
      `<span class="tk-kw">data</span> <span class="tk-ty">Reward</span> {`,
      `    <span class="tk-kw">var</span> amount: <span class="tk-ty">int</span> = <span class="tk-num">10</span>`,
      `}`,
      ``,
      `<span class="tk-kw">func</span> <span class="tk-fn">doubled</span>(value: <span class="tk-ty">int</span>): <span class="tk-ty">int</span> {`,
      `    <span class="tk-kw">return</span> value * <span class="tk-num">2</span>`,
      `}`,
      ``,
      `<span class="tk-kw">func</span> <span class="tk-fn">main</span>() {`,
      `    <span class="tk-kw">var</span> reward = <span class="tk-ty">Reward</span>()`,
      `    <span class="tk-kw">var</span> transform: (<span class="tk-ty">int</span>) -&gt; <span class="tk-ty">int</span> = { it + <span class="tk-num">5</span> }`,
      `    <span class="tk-fn">print</span>(<span class="tk-fn">doubled</span>(transform(reward.amount)))`,
      `}`,
    ],
    outputFile: "data/demo/function/main.mcfunction",
    outputTag: isZh.value ? "编译输出" : "Datapack Output",
    outputLines: [
      `<span class="tk-cm"># Folded by O2 constant propagation</span>`,
      `<span class="tk-cmd">tellraw @a "30"</span>`,
    ],
    runtimeResult: "30",
  },
  {
    id: "version",
    tab: isZh.value ? "跨版本条件编译" : "Cross-Version #if",
    file: "src/greet.mcfpp",
    badge: "1.21 ~ 26.3+",
    summary: isZh.value
      ? "通过 #if MC 版本条件指令，同一份代码可分别输出不同 Minecraft 目标版本的数据包。"
      : "Emit version-specific vanilla commands for 1.21 through 26.3+ from a single source.",
    docLink: makeLink("/quickstart/minecraft-versions"),
    docLabel: isZh.value ? "了解版本指令 →" : "Version Directives →",
    rawCode: `#if MC >= 26.1
func greet() {
    /say 26.1 or newer
}
#elif MC >= 1.21.6
func greet() {
    /say 1.21.6 to 1.21.8
}
#else
func greet() {
    /say older version
}
#endif`,
    highlighted: [
      `<span class="tk-dir">#if</span> <span class="tk-ty">MC</span> &gt;= <span class="tk-num">26.1</span>`,
      `<span class="tk-kw">func</span> <span class="tk-fn">greet</span>() {`,
      `    <span class="tk-cmd-root">/say</span> <span class="tk-str">26.1 or newer</span>`,
      `}`,
      `<span class="tk-dir">#elif</span> <span class="tk-ty">MC</span> &gt;= <span class="tk-num">1.21.6</span>`,
      `<span class="tk-kw">func</span> <span class="tk-fn">greet</span>() {`,
      `    <span class="tk-cmd-root">/say</span> <span class="tk-str">1.21.6 to 1.21.8</span>`,
      `}`,
      `<span class="tk-dir">#else</span>`,
      `<span class="tk-kw">func</span> <span class="tk-fn">greet</span>() {`,
      `    <span class="tk-cmd-root">/say</span> <span class="tk-str">older version</span>`,
      `}`,
      `<span class="tk-dir">#endif</span>`,
    ],
    outputFile: "mcfpp.toml (version = \"26.3\")",
    outputTag: isZh.value ? "目标输出" : "Emitted Command",
    outputLines: [
      `<span class="tk-cm"># data/demo/function/greet.mcfunction</span>`,
      `<span class="tk-cmd-root">say</span> <span class="tk-str">26.1 or newer</span>`,
    ],
    runtimeResult: "26.1 or newer",
  },
  {
    id: "commands",
    tab: isZh.value ? "命令块与插值" : "Command Blocks",
    file: "src/commands.mcfpp",
    badge: "/{ ... }",
    summary: isZh.value
      ? "在 /{ ... } 命令块中直接编写原版指令，用 ${...} 插入变量，并用 / 切换回 MCFPP 控制流。"
      : "Mix vanilla commands, ${expr} interpolation, and ordinary MCFPP statements seamlessly.",
    docLink: makeLink("/quickstart/02base/05original-command"),
    docLabel: isZh.value ? "查看命令语法 →" : "Command Syntax →",
    rawCode: `func commands() {
    var count = 1
    /{
        say hello
        /count += 1
        say count: \${count}
        /if count > 0 {
            /say inside ordinary MCFPP block
        }
    }
}`,
    highlighted: [
      `<span class="tk-kw">func</span> <span class="tk-fn">commands</span>() {`,
      `    <span class="tk-kw">var</span> count = <span class="tk-num">1</span>`,
      `    /{`,
      `        <span class="tk-cmd-root">say</span> <span class="tk-str">hello</span>`,
      `        <span class="tk-kw">/</span>count += <span class="tk-num">1</span>`,
      `        <span class="tk-cmd-root">say</span> <span class="tk-str">count:</span> <span class="tk-dir">\${</span>count<span class="tk-dir">}</span>`,
      `        <span class="tk-kw">/if</span> count &gt; <span class="tk-num">0</span> {`,
      `            <span class="tk-cmd-root">/say</span> <span class="tk-str">inside ordinary MCFPP block</span>`,
      `        }`,
      `    }`,
      `}`,
    ],
    outputFile: "data/demo/function/commands.mcfunction",
    outputTag: isZh.value ? "生成指令" : "Generated Commands",
    outputLines: [
      `<span class="tk-cmd-root">say</span> <span class="tk-str">hello</span>`,
      `<span class="tk-cmd-root">say</span> <span class="tk-str">count:</span> <span class="tk-num">2</span>`,
      `<span class="tk-cmd-root">say</span> <span class="tk-str">inside ordinary MCFPP block</span>`,
    ],
    runtimeResult: "hello · count: 2",
  },
  {
    id: "mni",
    tab: isZh.value ? "Kotlin MNI 宏" : "Kotlin MNI",
    file: "src/main.mcfpp",
    badge: "@MNIMacro",
    summary: isZh.value
      ? "在编译期运行宿主 Kotlin 代码并构造表达式 AST，让数据包具备完整的 JVM 工具链能力。"
      : "Execute host Kotlin during compilation to generate expressions and datapack logic.",
    docLink: makeLink("/quickstart/09mni/01mni-framework"),
    docLabel: isZh.value ? "学习 Kotlin MNI →" : "Explore Kotlin MNI →",
    rawCode: `func answer(): int = example.mni.Example.answer

func main() {
    print(answer())
}`,
    highlighted: [
      `<span class="tk-cm">// src/main/mcfpp/main.mcfpp</span>`,
      `<span class="tk-kw">func</span> <span class="tk-fn">answer</span>(): <span class="tk-ty">int</span> = example.mni.Example.answer`,
      ``,
      `<span class="tk-kw">func</span> <span class="tk-fn">main</span>() {`,
      `    <span class="tk-fn">print</span>(<span class="tk-fn">answer</span>())`,
      `}`,
    ],
    outputFile: "Example.kt (Kotlin MNI Host)",
    outputTag: isZh.value ? "Kotlin 宏定义" : "Kotlin Macro Host",
    outputLines: [
      `<span class="tk-dir">@JvmStatic</span>`,
      `<span class="tk-dir">@MNIMacro</span>(returnType = <span class="tk-str">"int"</span>)`,
      `<span class="tk-kw">fun</span> <span class="tk-fn">answer</span>(ctx: <span class="tk-ty">MacroContext</span>) = ... <span class="tk-cm">// -> 42</span>`,
    ],
    runtimeResult: "42",
  },
]);

const current = computed(() => examples.value[activeIndex.value]);
const playgroundLink = computed(() => makeLink("/playground"));

async function copySource() {
  try {
    await navigator.clipboard.writeText(current.value.rawCode);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 1600);
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <section class="mcfpp-examples-section" aria-label="MCFPP Code Examples">
    <div class="mcfpp-examples-container">
      <div class="mcfpp-examples-bar">
        <div class="mcfpp-examples-tabs" role="tablist">
          <button
            v-for="(item, idx) in examples"
            :key="item.id"
            role="tab"
            type="button"
            class="mcfpp-tab-btn"
            :class="{ 'is-active': activeIndex === idx }"
            :aria-selected="activeIndex === idx"
            @click="activeIndex = idx"
          >
            {{ item.tab }}
          </button>
        </div>

        <a class="mcfpp-examples-cta" :href="playgroundLink">
          {{ isZh ? "在 Playground 中在线运行 →" : "Try in Playground →" }}
        </a>
      </div>

      <div class="mcfpp-examples-grid">
        <!-- 左侧：MCFPP 源码面板 -->
        <div class="mcfpp-code-panel">
          <div class="mcfpp-panel-bar">
            <span class="mcfpp-panel-file">{{ current.file }}</span>
            <div class="mcfpp-panel-actions">
              <span class="mcfpp-panel-badge">{{ current.badge }}</span>
              <button type="button" class="mcfpp-copy-btn" @click="copySource">
                {{ copied ? (isZh ? "已复制" : "Copied") : (isZh ? "复制" : "Copy") }}
              </button>
            </div>
          </div>
          <pre class="mcfpp-panel-pre"><code v-html="current.highlighted.join('\n')"></code></pre>
        </div>

        <!-- 右侧：编译产物 + 说明 + 直达链接 -->
        <div class="mcfpp-output-panel">
          <div class="mcfpp-panel-bar">
            <span class="mcfpp-panel-file">{{ current.outputFile }}</span>
            <span class="mcfpp-panel-tag">{{ current.outputTag }}</span>
          </div>
          <pre class="mcfpp-panel-pre mcfpp-panel-pre-out"><code v-html="current.outputLines.join('\n')"></code></pre>

          <div class="mcfpp-panel-summary">
            <div class="mcfpp-result-line">
              <span class="mcfpp-result-label">{{ isZh ? "运行结果" : "Result" }}</span>
              <code class="mcfpp-result-value">{{ current.runtimeResult }}</code>
            </div>
            <p class="mcfpp-summary-desc">{{ current.summary }}</p>
            <a class="mcfpp-summary-link" :href="current.docLink">
              {{ current.docLabel }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
