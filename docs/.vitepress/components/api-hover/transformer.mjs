import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import MarkdownIt from 'markdown-it'
import { snippetKey, syntaxCandidates } from './analysis.mjs'
import { kindLabel, tagLabel, localizedDocumentation } from './i18n.mjs'

const markdown = new MarkdownIt({ html: false, linkify: true })
const escape = markdown.utils.escapeHtml
const identifiers = /[\p{L}_][\p{L}\p{N}_]*/gu

/** Accept the compiler's detached documentation export, without loading a compiler in Node or the browser. */
export function validateDocumentation(model, source = 'docs.json') {
  if (model?.schemaVersion !== 1 || !Array.isArray(model.symbols))
    throw new Error(`${source}: expected MCFPP documentation schemaVersion 1`)
  if (model.language && !['mcfpp', 'kotlin'].includes(model.language))
    throw new Error(`${source}: unsupported API language ${model.language}`)
  const ids = new Set()
  for (const symbol of model.symbols) {
    if (!['id', 'name', 'signature', 'namespace', 'kind', 'packageId', 'markdown'].every(key => typeof symbol[key] === 'string')
      || !Array.isArray(symbol.tags) || !Array.isArray(symbol.parameters))
      throw new Error(`${source}: invalid documentation symbol`)
    if (ids.has(symbol.id)) throw new Error(`${source}: duplicate symbol ID ${symbol.id}`)
    ids.add(symbol.id)
  }
  return model
}

export function loadCatalogs(directory) {
  return Object.fromEntries(readdirSync(directory).filter(name => name.endsWith('.json')).sort().map(name => [
    name.slice(0, -5), validateDocumentation(JSON.parse(readFileSync(join(directory, name), 'utf8')), name),
  ]))
}

export function qualifiedName(symbol) {
  const separator = symbol.language === 'kotlin' ? '.' : ':'
  return `${symbol.namespace}${separator}${symbol.owner ? `${symbol.owner}.` : ''}${symbol.name}`
}

function identifierScope(scopes, language) {
  if (language === 'mcfpp') return scopes.some(scope => /^(?:entity\.name\.|support\.type\.|variable\.other\.)/.test(scope))
  // Kotlin's grammar leaves ordinary properties and named arguments in source.kotlin.
  // Nested template expressions are code; a string/comment nested inside one is text.
  if (scopes.some(scope => scope.startsWith('comment.'))) return false
  const string = scopes.findLastIndex(scope => scope.startsWith('string.'))
  const template = scopes.findLastIndex(scope => scope === 'meta.template.expression.kotlin')
  return string < 0 || template > string
}

function renderSymbol(original, locale, translations) {
  const symbol = localizedDocumentation(original, locale, translations)
  const deprecated = symbol.tags.filter(tag => tag.name === 'deprecated')
  const tags = symbol.tags.filter(tag => tag.name !== 'deprecated')
  return `<section class="mcfpp-api-declaration">
    <div class="mcfpp-api-origin">${escape(qualifiedName(symbol))} · ${escape(kindLabel(symbol.kind, locale))}</div>
    <pre class="mcfpp-api-signature"><code>${escape(symbol.signature)}</code></pre>
    ${deprecated.map(tag => `<aside class="mcfpp-api-deprecated"><strong>${escape(tagLabel('deprecated', locale))}</strong>${markdown.render(tag.content ?? '')}</aside>`).join('')}
    <div class="mcfpp-api-markdown">${markdown.render(symbol.markdown)}</div>
    ${tags.length ? `<dl class="mcfpp-api-tags">${tags.map(tag => `<dt>${escape(tagLabel(tag.name, locale))}${tag.subject ? ` <code>${escape(tag.subject)}</code>` : ''}</dt><dd>${markdown.render(tag.content ?? '')}</dd>`).join('')}</dl>` : ''}
  </section>`
}

/** MCFPP fences use default catalogs; api=my-library selects a library explicitly.
 * Kotlin remains opt-in. no-api disables cards on an individual fence.
 * This is a documentation lookup, not complete compiler overload resolution.
 */
export function transformerApiHover(catalogs, { translations = {}, analysis = new Map() } = {}) {
  const cache = new Map()
  const missing = new Set()
  return {
    name: 'mcfpp:api-hover',
    tokens(tokens) {
      const language = this.options.lang === 'kt' ? 'kotlin' : this.options.lang
      if (!['mcfpp', 'kotlin'].includes(language)) return
      const attributes = this.options.meta?.__raw ?? ''
      if (/(?:^|\s)no-api(?=\s|$)/.test(attributes)) return
      const enabled = attributes.match(/(?:^|\s)api(?:=([\w,-]+))?(?=\s|$)/)
      const defaults = language === 'mcfpp' ? Object.keys(catalogs).filter(name => catalogs[name].default === true
        && (catalogs[name].language ?? 'mcfpp') === language) : []
      if (!enabled && !defaults.length) return
      const names = enabled ? enabled[1]?.split(',') ?? Object.keys(catalogs).filter(name => (catalogs[name].language ?? 'mcfpp') === language) : defaults
      const selection = attributes.match(/(?:^|\s)symbols=([^\s]+)/)?.[1]?.split(',')
      const context = attributes.match(/(?:^|\s)context=([^\s]+)/)?.[1]
      const bindings = context ? { context } : {}
      const key = snippetKey(this.source)
      const snippet = language === 'kotlin' ? analysis.get(key) : undefined
      const facts = snippet?.complete ? new Map(snippet.occurrences.map(fact => [fact.start, fact])) : undefined
      if (language === 'kotlin' && analysis.size && !snippet && !missing.has(key)) {
        missing.add(key)
        console.warn('Kotlin API snippet changed; run pnpm docs:analyze. Keeping name candidates until it is parsed.')
      }
      const byName = new Map()
      for (const name of names) {
        const model = catalogs[name]
        if (!model) throw new Error(`Unknown MCFPP API catalog "${name}"`)
        if ((model.language ?? 'mcfpp') !== language) throw new Error(`API catalog "${name}" does not document ${language}`)
        for (const original of model.symbols) {
          const symbol = { ...original, language }
          const group = byName.get(symbol.name) ?? new Map()
          group.set(`${symbol.packageId}/${symbol.id}`, symbol)
          byName.set(symbol.name, group)
        }
      }
      // Multi-theme Shiki tokens omit scope explanations. A single-theme pass supplies
      // the TextMate scopes, including nested interpolation, comments, and strings.
      const theme = this.options.themes?.light ?? this.options.theme ?? 'github-light'
      const explained = this.codeToTokens(this.source, { lang: language, theme, includeExplanation: true }).tokens
      const ranges = []
      for (const line of explained) for (const token of line) {
        let offset = token.offset
        for (const part of token.explanation ?? []) {
          const scopes = part.scopes.map(scope => scope.scopeName)
          if (identifierScope(scopes, language)) {
            for (const match of part.content.matchAll(identifiers)) {
              const start = offset + match.index
              const fact = facts?.get(start)
              if (facts && (!fact || fact.length !== match[0].length)) continue
              const group = byName.get(fact?.lookupName ?? match[0])
              if (group) {
                const symbols = (facts ? syntaxCandidates([...group.values()], fact, byName, bindings) : [...group.values()])
                  .filter(symbol => !selection || selection.includes(symbol.id) || selection.includes(qualifiedName(symbol)))
                  .sort((a, b) => qualifiedName(a).localeCompare(qualifiedName(b)) || a.signature.localeCompare(b.signature))
                if (!symbols.length) continue
                const cacheKey = JSON.stringify(symbols)
                if (!cache.has(cacheKey)) cache.set(cacheKey, Object.fromEntries(['en', 'zh'].map(locale => [locale,
                  symbols.map(symbol => renderSymbol(symbol, locale, translations)).join('')])))
                ranges.push({ start, end: start + match[0].length, name: match[0], html: cache.get(cacheKey), count: symbols.length,
                  resolution: facts ? 'syntax' : 'name' })
              }
            }
          }
          offset += part.content.length
        }
      }
      const starts = [0]
      for (const newline of this.source.matchAll(/\r?\n/g)) starts.push(newline.index + newline[0].length)
      this.meta.mcfppApiHover = { ranges, starts }
      return tokens.map(line => line.flatMap(token => {
        const points = [0, ...ranges.flatMap(range => [range.start, range.end])
          .filter(point => token.offset < point && point < token.offset + token.content.length)
          .map(point => point - token.offset), token.content.length].sort((a, b) => a - b)
        return [...new Set(points)].slice(0, -1).map((start, index, all) => ({
          ...token, offset: token.offset + start,
          content: token.content.slice(start, all[index + 1] ?? token.content.length),
        }))
      }))
    },
    span(node, line, column) {
      const state = this.meta.mcfppApiHover
      if (!state) return
      const offset = state.starts[line - 1] + column
      const range = state.ranges.find(range => range.start === offset)
      if (!range) return
      this.addClassToHast(node, 'mcfpp-api-trigger')
      Object.assign(node.properties, {
        'data-mcfpp-api': range.html.en,
        'data-mcfpp-api-zh': range.html.zh,
        'data-mcfpp-api-name': range.name,
        'data-mcfpp-api-count': range.count,
        'data-mcfpp-api-resolution': range.resolution,
        tabindex: 0,
        role: 'button',
        'aria-label': `${range.name} · API (${range.count})`,
        'aria-haspopup': 'dialog',
        'aria-expanded': 'false',
      })
    },
  }
}
