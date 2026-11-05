<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { CompilerDiagnostic, GeneratedFile } from "../types";

const props = defineProps<{
  files: GeneratedFile[];
  message: string;
  diagnostics: CompilerDiagnostic[];
  failed: boolean;
}>();
const selected = ref("");
const output = ref<HTMLPreElement>();
const currentFile = computed(() =>
  props.files.find((file) => file.path === selected.value),
);
// 有产物时只显示文件（包括空文件）；没有产物时在同一区域显示进度或实际诊断。
const outputState = computed(() =>
  currentFile.value ? "file" : props.failed ? "error" : "status",
);
const outputText = computed(() => {
  if (currentFile.value) return currentFile.value.content;
  return props.failed
    ? [props.message, ...props.diagnostics.map((item) => item.message)]
        .filter(Boolean)
        .join("\n\n")
    : props.message;
});

watch(
  () => props.files,
  (files) => {
    const main = files.find((file) => /\/main(?:_|\.)/.test(file.path));
    selected.value = (main ?? files[0])?.path ?? "";
  },
  { immediate: true },
);

watch(outputText, () => {
  output.value?.scrollTo(0, 0);
});
</script>

<template>
  <div class="pane-header">
    <h2 id="output-title">编译结果</h2>
    <span id="file-count">{{ files.length }} 个文件</span>
  </div>
  <div class="file-picker">
    <label for="files">生成文件</label>
    <select id="files" v-model="selected" :disabled="files.length === 0">
      <option v-if="files.length === 0" value="">编译后选择文件</option>
      <option v-for="file in files" :key="file.path" :value="file.path">
        {{ file.path }}
      </option>
    </select>
  </div>
  <pre
    id="output"
    ref="output"
    tabindex="0"
    :data-state="outputState"
    :aria-label="currentFile ? '生成的文件内容' : '编译状态与诊断'"
    :aria-live="currentFile ? 'off' : 'polite'"
  >{{ outputText }}</pre>
  <div class="pane-footer">
    <span id="selected-file">{{ currentFile?.path ?? "等待编译" }}</span>
  </div>
</template>
