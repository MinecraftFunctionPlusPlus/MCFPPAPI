<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { highlightSource } from "../editor/highlight";

defineProps<{
  initializationTime: string;
  compileTime: string;
}>();
const source = defineModel<string>({ required: true });
const emit = defineEmits<{ compile: [] }>();
const textarea = ref<HTMLTextAreaElement>();
const mirror = ref<HTMLPreElement>();
const highlighted = computed(() => highlightSource(source.value));

function syncScroll(): void {
  if (!textarea.value || !mirror.value) return;
  mirror.value.scrollTop = textarea.value.scrollTop;
  mirror.value.scrollLeft = textarea.value.scrollLeft;
}

function handleKeydown(event: KeyboardEvent): void {
  const input = textarea.value;
  if (!input || event.isComposing) return;

  if (event.key === "Tab") {
    event.preventDefault();
    input.setRangeText("    ", input.selectionStart, input.selectionEnd, "end");
    source.value = input.value;
  }
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    emit("compile");
  }
}

// 等 Vue 更新镜像后再同步，避免长文本或换行改变镜像尺寸时滚动错位。
watch(source, async () => {
  await nextTick();
  syncScroll();
});
</script>

<template>
  <section class="pane editor-pane" aria-labelledby="source-title">
    <div class="pane-header">
      <h2 id="source-title">
        <span class="dot" aria-hidden="true"></span> main.mcfpp
      </h2>
    </div>
    <div class="source-editor">
      <!-- 镜像只负责着色，输入、光标、选择和辅助技术仍使用原生文本框。 -->
      <pre
        id="source-highlight"
        ref="mirror"
        class="source-highlight"
        aria-hidden="true"
      ><span
        v-for="(token, index) in highlighted"
        :key="index"
        :class="token.kind ? `token-${token.kind}` : undefined"
      >{{ token.text }}</span></pre>
      <textarea
        id="source"
        ref="textarea"
        v-model="source"
        aria-label="main.mcfpp 源代码"
        spellcheck="false"
        autocapitalize="off"
        autocomplete="off"
        wrap="off"
        @scroll="syncScroll"
        @keydown="handleKeydown"
      ></textarea>
    </div>
    <div class="pane-footer">
      <div class="editor-timing">
        <span id="init-time">{{ initializationTime || "正在初始化…" }}</span>
        <span v-if="compileTime" id="compile-time">编译 {{ compileTime }}</span>
      </div>
      <span>Tab 缩进 · Ctrl / Cmd + Enter 编译</span>
    </div>
  </section>
</template>
