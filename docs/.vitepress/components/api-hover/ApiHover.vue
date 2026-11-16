<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const { lang } = useData()
const route = useRoute()
const closeLabel = computed(() => lang.value.startsWith('zh') ? '关闭文档' : 'Close documentation')
const card = ref<HTMLElement>()
const content = ref('')
const name = ref('')
const count = ref(0)
const position = ref({ left: '0px', top: '0px', maxHeight: '440px', visibility: 'hidden' as 'hidden' | 'visible' })
let anchor: HTMLElement | undefined
let timer: ReturnType<typeof setTimeout> | undefined
let pinned = false

function clearTimer() { clearTimeout(timer) }
function close() {
  clearTimer()
  anchor?.setAttribute('aria-expanded', 'false')
  anchor?.removeAttribute('aria-controls')
  anchor = undefined
  pinned = false
  content.value = ''
}
function trigger(target: EventTarget | null) {
  return target instanceof Element ? target.closest<HTMLElement>('[data-mcfpp-api]') ?? undefined : undefined
}
function inside(target: EventTarget | null) {
  return target instanceof Node && (anchor?.contains(target) || card.value?.contains(target))
}
async function open(target: HTMLElement, focus = false, keepOpen = false) {
  clearTimer()
  if (anchor !== target) {
    close()
    anchor = target
    content.value = lang.value.startsWith('zh') ? target.dataset.mcfppApiZh ?? target.dataset.mcfppApi ?? '' : target.dataset.mcfppApi ?? ''
    name.value = target.dataset.mcfppApiName ?? ''
    count.value = Number(target.dataset.mcfppApiCount ?? 1)
    target.setAttribute('aria-expanded', 'true')
    target.setAttribute('aria-controls', 'mcfpp-api-card')
    position.value.visibility = 'hidden'
  }
  if (focus || keepOpen) pinned = true
  await nextTick()
  if (anchor !== target || !card.value) return
  const bounds = target.getBoundingClientRect()
  const box = card.value.getBoundingClientRect()
  const left = Math.max(12, Math.min(bounds.left, window.innerWidth - box.width - 12))
  const above = Math.max(0, bounds.top - 8 - 12)
  const below = Math.max(0, window.innerHeight - bounds.bottom - 8 - 12)
  const preferredHeight = Math.min(440, card.value.scrollHeight + box.height - card.value.clientHeight)
  const placeBelow = below >= preferredHeight || (above < preferredHeight && below >= above)
  // Fit the card on one side of the name. Clamping a full-height card to the
  // viewport would cover the name when neither side has enough room.
  const height = Math.min(preferredHeight, placeBelow ? below : above)
  const top = placeBelow ? bounds.bottom + 8 : bounds.top - 8 - height
  position.value = { left: `${left}px`, top: `${top}px`, maxHeight: `${height}px`, visibility: 'visible' }
  if (focus) {
    // The visibility update must reach the DOM before the dialog can receive focus.
    await nextTick()
    if (anchor === target) card.value?.focus({ preventScroll: true })
  }
}
function scheduleClose() {
  clearTimer()
  if (!pinned) timer = setTimeout(close, 180)
}
function onOver(event: PointerEvent) {
  if (event.pointerType === 'touch' || pinned) return
  const target = trigger(event.target)
  if (target) {
    clearTimer()
    if (target !== anchor) timer = setTimeout(() => void open(target), 180)
  } else if (inside(event.target)) clearTimer()
}
function onOut(event: PointerEvent) {
  if (!inside(event.relatedTarget)) scheduleClose()
}
function onFocus(event: FocusEvent) {
  const target = trigger(event.target)
  // Pointer focus precedes the synthesized touch click. Opening here can change
  // its hit target; touch and mouse activation instead use the click handler.
  if (target?.matches(':focus-visible')) void open(target)
  else if (inside(event.target)) clearTimer()
}
function onBlur(event: FocusEvent) {
  if (!inside(event.relatedTarget)) { pinned = false; scheduleClose() }
}
function onClick(event: MouseEvent) {
  const target = trigger(event.target)
  if (target) void open(target, false, true)
  else if (!inside(event.target)) close()
}
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && anchor) {
    const restore = anchor
    close()
    // Focus before clearing the card also works when the close button has focus.
    restore.focus({ preventScroll: true })
    close()
  } else if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
    const target = trigger(event.target)
    if (target) { event.preventDefault(); void open(target, true) }
  }
}
function onScroll(event: Event) {
  if (!(event.target instanceof Node && card.value?.contains(event.target))) close()
}
function dismiss() {
  const restore = anchor
  close()
  restore?.focus({ preventScroll: true })
  close()
}

watch(() => route.path, close)
watch(lang, close)
onMounted(() => {
  document.addEventListener('pointerover', onOver)
  document.addEventListener('pointerout', onOut)
  document.addEventListener('focusin', onFocus)
  document.addEventListener('focusout', onBlur)
  document.addEventListener('click', onClick)
  document.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', close)
})
onBeforeUnmount(() => {
  close()
  document.removeEventListener('pointerover', onOver)
  document.removeEventListener('pointerout', onOut)
  document.removeEventListener('focusin', onFocus)
  document.removeEventListener('focusout', onBlur)
  document.removeEventListener('click', onClick)
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', close)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="content" id="mcfpp-api-card" ref="card" class="mcfpp-api-card" role="dialog"
      :aria-label="`${name} · API`" tabindex="-1" :style="position">
      <header class="mcfpp-api-header">
        <span>{{ name }} <small v-if="count > 1">{{ count }} {{ lang.startsWith('zh') ? '个候选声明' : 'declarations' }}</small></span>
        <button type="button" :aria-label="closeLabel" @click="dismiss">×</button>
      </header>
      <!-- HTML is rendered at build time with MarkdownIt html:false; code remains under v-pre. -->
      <div class="mcfpp-api-content" v-html="content" />
    </div>
  </Teleport>
</template>

<style>
.vp-doc .mcfpp-api-trigger { cursor: help; text-decoration: underline dotted var(--vp-c-brand-1); text-underline-offset: 4px; }
.vp-doc .mcfpp-api-trigger:hover { background: transparent; outline: none; }
.vp-doc .mcfpp-api-trigger:focus-visible:not(:hover) { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; border-radius: 2px; }
.mcfpp-api-card { position: fixed; z-index: 100; width: min(460px, calc(100vw - 24px)); max-height: min(440px, calc(100dvh - 24px)); overflow: auto; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg); color: var(--vp-c-text-1); box-shadow: var(--vp-shadow-3); font-size: 14px; line-height: 1.65; }
.mcfpp-api-card:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.mcfpp-api-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 10px 16px; border-bottom: 1px solid var(--vp-c-divider); font-weight: 600; }
.mcfpp-api-header small { margin-left: 8px; color: var(--vp-c-text-2); font-weight: 400; }
.mcfpp-api-header button { min-width: 28px; min-height: 28px; border-radius: 5px; color: var(--vp-c-text-2); font-size: 22px; line-height: 1; }
.mcfpp-api-header button:hover { background: var(--vp-c-default-soft); }
.mcfpp-api-declaration { padding: 16px; }
.mcfpp-api-declaration + .mcfpp-api-declaration { border-top: 1px solid var(--vp-c-divider); }
.mcfpp-api-origin { color: var(--vp-c-text-2); font-size: 12px; overflow-wrap: anywhere; }
.mcfpp-api-card pre { margin: 8px 0 12px; padding: 10px 12px; border-radius: 6px; background: var(--vp-c-bg-soft); overflow-x: auto; font-size: 12px; line-height: 1.6; }
.mcfpp-api-card code { font-family: var(--vp-font-family-mono); }
.mcfpp-api-card :not(pre) > code { padding: 1px 4px; border-radius: 3px; background: var(--vp-c-default-soft); font-size: .9em; }
.mcfpp-api-card p { margin: 6px 0; }
.mcfpp-api-card h1, .mcfpp-api-card h2, .mcfpp-api-card h3, .mcfpp-api-card h4 { margin: 12px 0 6px; font-size: 15px; font-weight: 600; }
.mcfpp-api-card ul, .mcfpp-api-card ol { margin: 6px 0; padding-left: 20px; }
.mcfpp-api-card ul { list-style: disc; }
.mcfpp-api-card ol { list-style: decimal; }
.mcfpp-api-card a { color: var(--vp-c-brand-1); text-decoration: underline; }
.mcfpp-api-card blockquote { border-left: 3px solid var(--vp-c-divider); padding-left: 12px; color: var(--vp-c-text-2); }
.mcfpp-api-card img { max-width: 100%; }
.mcfpp-api-tags { margin-top: 12px; }
.mcfpp-api-tags dt { margin-top: 8px; font-family: var(--vp-font-family-mono); font-size: 12px; color: var(--vp-c-text-2); }
.mcfpp-api-tags dd { margin-left: 12px; }
.mcfpp-api-deprecated { border-left: 3px solid var(--vp-c-warning-1); padding-left: 10px; color: var(--vp-c-text-2); }
.mcfpp-api-deprecated strong { color: var(--vp-c-warning-1); font-size: 12px; }
</style>
