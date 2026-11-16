import { mkdir, readFile, writeFile, rename } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { loadCatalogs } from '../docs/.vitepress/components/api-hover/transformer.mjs'
import { documentationHash } from '../docs/.vitepress/components/api-hover/i18n.mjs'
import { zh, en } from './api-doc-translations.mjs'
import { zh as publicZh, en as publicEn, neutral } from './api-doc-translations-public.mjs'

const catalogs = loadCatalogs(fileURLToPath(new URL('../docs/assets/api/', import.meta.url)))
const directory = new URL('../docs/assets/api-i18n/', import.meta.url)
const missing = new Set()
function translate(text, locale, dictionary) {
  if (!text || neutral.has(text)) return text
  if (Object.hasOwn(dictionary, text)) return dictionary[text]
  const sourceLocale = /\p{Script=Han}/u.test(text) ? 'zh' : 'en'
  if (sourceLocale === locale) return text
  missing.add(`${locale}: ${JSON.stringify(text)}`)
  return text
}
const outputs = []
for (const [locale, dictionary] of Object.entries({ zh: { ...publicZh, ...zh }, en: { ...publicEn, ...en } })) {
  const symbols = {}
  for (const catalog of Object.values(catalogs)) for (const symbol of catalog.symbols) {
    symbols[symbol.documentationKey ?? symbol.id] = {
      sourceHash: documentationHash(symbol), markdown: translate(symbol.markdown, locale, dictionary),
      tags: symbol.tags.map(tag => ({ ...tag, content: translate(tag.content ?? '', locale, dictionary) })),
    }
  }
  outputs.push({ locale, symbols })
}
if (missing.size) throw new Error(`Missing public API translations (${missing.size}):\n${[...missing].join('\n')}`)
if (process.argv.includes('--check')) {
  for (const output of outputs) {
    const expected = JSON.stringify({ schemaVersion: 1, ...output }, null, 2) + '\n'
    const actual = await readFile(new URL(`${output.locale}.json`, directory), 'utf8')
    if (actual !== expected) throw new Error(`${output.locale}: API translations are stale; run pnpm docs:i18n`)
  }
  console.log('Public API bodies and tags have current zh/en translations.')
  process.exit(0)
}
await mkdir(directory, { recursive: true })
for (const output of outputs) {
  const target = new URL(`${output.locale}.json`, directory)
  const temporary = new URL(`${output.locale}.json.tmp`, directory)
  await writeFile(temporary, JSON.stringify({ schemaVersion: 1, ...output }, null, 2) + '\n')
  await rename(temporary, target)
  console.log(`${output.locale}: ${Object.keys(output.symbols).length} declarations, bodies and tags complete`)
}
