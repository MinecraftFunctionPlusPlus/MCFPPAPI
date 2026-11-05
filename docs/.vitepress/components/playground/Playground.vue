<script setup lang="ts">
import ExecutionPanel from "./components/ExecutionPanel.vue";
import GeneratedFiles from "./components/GeneratedFiles.vue";
import SourceEditor from "./components/SourceEditor.vue";
import { usePlayground } from "./usePlayground";

const {
  source,
  files,
  diagnostics,
  compilation,
  execution,
  entry,
  entries,
  showFeedback,
  busy,
  running,
  canCompile,
  canRun,
  runOutput,
  compile,
  runGenerated,
  stop,
  reload,
} = usePlayground();
</script>

<template>
  <section class="mcfpp-playground" aria-label="MCFPP Playground">
    <div class="toolbar">
      <div>
        <h1>Playground</h1>
      </div>
      <div class="actions">
        <span
          id="status"
          class="status"
          :data-state="compilation.state"
          role="status"
          >{{ compilation.status }}
        </span>
        <button
          v-if="compilation.needsReload"
          id="reload"
          class="secondary"
          @click="reload"
        >
          重新加载
        </button>
        <button id="compile" :disabled="!canCompile" @click="compile">
          编译并运行 <kbd>Ctrl ↵</kbd>
        </button>
      </div>
    </div>
    <div class="workspace">
      <SourceEditor
        v-model="source"
        :initialization-time="compilation.initializationTime"
        :compile-time="compilation.elapsed"
        @compile="compile"
      />
      <section class="pane output-pane" aria-labelledby="output-title">
        <GeneratedFiles
          :files="files"
          :message="compilation.message"
          :diagnostics="diagnostics"
          :failed="compilation.state === 'error'"
        />
        <ExecutionPanel
          v-model:entry="entry"
          v-model:show-feedback="showFeedback"
          :entries="entries"
          :can-run="canRun"
          :busy="busy"
          :running="running"
          :status="execution.status"
          :state="execution.state"
          :output="runOutput"
          :message="execution.message"
          @run="runGenerated"
          @stop="stop"
        />
      </section>
    </div>
    <footer class="playground-footer">
      <span>源代码在浏览器内编译 · Java 25</span>
      <a href="https://cheerpj.com/" target="_blank" rel="noopener noreferrer"
        >Built with CheerpJ</a
      >
    </footer>
  </section>
</template>

<style src="./style.css"></style>
