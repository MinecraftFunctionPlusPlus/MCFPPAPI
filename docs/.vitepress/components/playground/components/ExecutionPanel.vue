<script setup lang="ts">
const entry = defineModel<string>("entry", { required: true });
const showFeedback = defineModel<boolean>("showFeedback", { required: true });
defineProps<{
  entries: string[];
  canRun: boolean;
  busy: boolean;
  running: boolean;
  status: string;
  state: string;
  output: string;
  message: string;
}>();
defineEmits<{ run: []; stop: [] }>();
</script>

<template>
  <section class="execution" aria-labelledby="execution-title">
    <div class="execution-toolbar">
      <h2 id="execution-title">
        运行结果
      </h2>
      <div class="execution-actions">
        <select
          id="entry"
          v-model="entry"
          aria-label="运行入口"
          :disabled="busy || entries.length === 0"
        >
          <option v-if="entries.length === 0" value="">编译后选择入口</option>
          <option v-for="id in entries" :key="id" :value="id">{{ id }}</option>
        </select>
        <button
          id="run"
          class="secondary"
          :disabled="!canRun"
          @click="$emit('run')"
        >
          运行
        </button>
        <button
          v-show="running"
          id="stop"
          class="secondary"
          @click="$emit('stop')"
        >
          停止
        </button>
      </div>
    </div>
    <pre
      id="run-output"
      :data-state="state"
      tabindex="0"
      aria-label="DSB 运行输出"
      aria-live="polite"
      >{{ output }}</pre
    >
    <div class="execution-footer">
      <p id="run-message">{{ message }}</p>
      <label
        ><input id="show-feedback" v-model="showFeedback" type="checkbox" />
        命令反馈</label
      >
    </div>
  </section>
</template>
