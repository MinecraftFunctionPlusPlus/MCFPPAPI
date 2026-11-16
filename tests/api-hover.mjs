import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createMarkdownRenderer } from 'vitepress'
import MarkdownIt from 'markdown-it'
import { loadCatalogs, transformerApiHover, validateDocumentation } from '../docs/.vitepress/components/api-hover/transformer.mjs'
import { loadSnippetAnalysis } from '../docs/.vitepress/components/api-hover/analysis.mjs'
import { loadLocalizations, localizedDocumentation, documentationHash } from '../docs/.vitepress/components/api-hover/i18n.mjs'

const docs = fileURLToPath(new URL('../docs/', import.meta.url))
const grammar = JSON.parse(await readFile(new URL('../docs/assets/lang/mcfpp.json', import.meta.url), 'utf8'))
const catalogs = loadCatalogs(fileURLToPath(new URL('../docs/assets/api/', import.meta.url)))
const base = catalogs.example.symbols.find(symbol => symbol.name === 'identity')
const fixture = {
  schemaVersion: 1,
  symbols: [
    { ...base, id: 'unsafe', name: '问候', signature: 'func 问候<T>(value: T): T', markdown: '**中文**\n\n- 一\n- 二\n\n<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))\n\n```mcfpp\nidentity(1)\n```', tags: [] },
    { ...base, id: 'one', name: 'same', namespace: 'one' },
    { ...base, id: 'two', name: 'same', namespace: 'two' },
  ],
}
const md = await createMarkdownRenderer(docs, {
  languages: [grammar], codeTransformers: [transformerApiHover({ ...catalogs, fixture })],
})
const render = (source, attributes = 'api=example', language = 'mcfpp') => md.render(`\`\`\`${language} ${attributes}\n${source}\n\`\`\``)
// Decode the HAST attributes using MarkdownIt's entity decoder; no browser is needed here.
const decoder = new MarkdownIt().utils.unescapeAll
const payloads = html => [...html.matchAll(/data-mcfpp-api="([^"]*)"/g)].map(match => decoder(match[1]))

let html = render('identity(10)')
assert.equal(payloads(html).length, 1)
assert.match(payloads(html)[0], /value: int/)
assert.match(payloads(html)[0], /value: bool/)
assert.match(payloads(html)[0], /@param/)
assert.match(payloads(html)[0], /@return/)
assert.match(html, /tabindex="0"/)
assert.match(html, /aria-haspopup="dialog"/)
assert.equal(payloads(render('oldRead(10)'))[0].includes('mcfpp-api-deprecated'), true)

assert.equal(payloads(render('identity(1)', '')).length, 0, 'demo catalogs are not enabled globally')
assert.equal(payloads(render('print("hello")', '')).length, 1, 'ordinary MCFPP fences use the core API catalog')
assert.equal(payloads(render('print("hello")', 'no-api')).length, 0, 'a fence can opt out')
assert.equal(payloads(render('// print(1)\nvar text = "print"\n/say print', '')).length, 0)
assert.match(payloads(render('scoreRef("points", "score")', ''))[0], /func scoreRef\(holder: string, objective: string\): ScoreRef/)
assert.equal(payloads(render('// identity(1)\n/// identity\nvar text = "identity"\nvar other = \'identity\'\n/say identity')).length, 0)
assert.equal(payloads(render('var text = """identity ${identity(1)} identity"""')).length, 1, 'only embedded code has a hover')
assert.equal(payloads(render('/say identity ${identity(1)}')).length, 1, 'command interpolation is code')
assert.equal(payloads(render('identity(1)\r\nidentity(2)')).length, 2, 'CRLF offsets remain correct')
assert.equal(payloads(render('var counter = Counter()\ncounter.read()', 'api=example symbols=docs:Counter.read')).length, 1)
assert.equal(payloads(render('same()', 'api=fixture'))[0].match(/mcfpp-api-declaration/g).length, 2)
assert.equal(payloads(render('same()', 'api=fixture symbols=one:same'))[0].match(/mcfpp-api-declaration/g).length, 1)
assert.equal(payloads(render('same()', 'api=fixture symbols=two'))[0].match(/mcfpp-api-declaration/g).length, 1, 'ID selectors select an exact declaration')
assert.throws(() => render('identity(1)', 'api=missing'), /Unknown MCFPP API catalog/)
assert.throws(() => validateDocumentation({ schemaVersion: 2, symbols: [] }), /schemaVersion 1/)
assert.throws(() => validateDocumentation({ schemaVersion: 1, symbols: [base, base] }), /duplicate symbol/)

html = payloads(render('问候<int>(1)', 'api=fixture'))[0]
assert.match(html, /<strong>中文<\/strong>/)
assert.match(html, /<ul>/)
assert.match(html, /<pre><code class="language-mcfpp">/)
assert.ok(!html.includes('<script>') && !html.includes('href="javascript:'), 'documentation HTML stays escaped')
assert.match(html, /&lt;script&gt;/)
assert.match(html, /&lt;T&gt;/)

const kotlin = catalogs['kotlin-mni']
assert.equal(kotlin.language, 'kotlin')
assert.equal(kotlin.symbols.filter(symbol => symbol.name === 'literal').length, 4)
assert.ok(!kotlin.symbols.some(symbol => symbol.name === 'builder' && symbol.owner === 'CodeScope'), 'private constructor properties stay private')
assert.match(kotlin.symbols.find(symbol => symbol.owner === 'SourceSpan' && symbol.name === 'startLine').markdown, /One-based line number/)
const literal = kotlin.symbols.find(symbol => symbol.name === 'literal' && symbol.parameters[0].type === 'Int')
assert.equal(literal.signature, 'fun literal(value: Int): Expr<IntT>', 'the declaration signature excludes the implementation')
assert.match(literal.markdown, /Creates an MCFPP int literal/)
const kotlinRender = (source, attributes = 'api=kotlin-mni', language = 'kotlin') => render(source, attributes, language)
html = kotlinRender('context.quote.block { val total = local("total", literal(1)) }')
assert.equal(payloads(html).length, 4, 'property access and trailing-lambda calls have Kotlin hovers')
assert.match(payloads(html).at(-1), /top.mcfpp.mni.api.CodeScope.literal/)
assert.equal(payloads(html).at(-1).match(/mcfpp-api-declaration/g).length, 4)
assert.equal(payloads(kotlinRender('literal(1)', 'api=kotlin-mni', 'kt')).length, 1, 'kt aliases Kotlin')
assert.equal(payloads(kotlinRender('literal(1)', '')).length, 0)
assert.equal(payloads(kotlinRender('literal(1)', 'api=kotlin-mni symbols=' + literal.id))[0].match(/mcfpp-api-declaration/g).length, 1)
assert.equal(payloads(kotlinRender('literal(1)', 'api=kotlin-mni symbols=top.mcfpp.mni.api.CodeScope.literal'))[0].match(/mcfpp-api-declaration/g).length, 4)
assert.equal(payloads(kotlinRender('// literal\n/** MacroContext literal */\nval sampleText = "literal MacroContext"\nval otherText = """literal quote"""')).length, 0)
assert.equal(payloads(kotlinRender('val sampleText = "literal ${literal(1)}"')).length, 1)
assert.equal(payloads(kotlinRender('@MNIMacro(normalParams = ["int"], returnType = "int")')).length, 3, 'annotation and named argument properties are documented')
assert.equal(payloads(kotlinRender('identity(1)\nliteral(1)', 'api')).length, 1, 'bare api uses catalogs for the fence language')
assert.throws(() => kotlinRender('identity(1)', 'api=example'), /does not document kotlin/)
const command = kotlin.symbols.find(symbol => symbol.name === 'Command' && !symbol.owner)
assert.ok(command.tags.some(tag => tag.name === 'constructor') && command.tags.some(tag => tag.name === 'see' && tag.subject === 'CommandPart'))
const translations = loadLocalizations(fileURLToPath(new URL('../docs/assets/api-i18n/', import.meta.url)))
for (const catalog of Object.values(catalogs)) for (const symbol of catalog.symbols) {
  for (const locale of ['zh', 'en']) {
    const entry = translations[locale][symbol.documentationKey ?? symbol.id]
    assert.ok(entry, `${locale}: ${symbol.signature} needs a localization entry`)
    assert.equal(entry.sourceHash, documentationHash(symbol), `${locale}: ${symbol.signature} has a stale translation`)
    assert.equal(typeof entry.markdown, 'string')
    assert.ok(!symbol.markdown || entry.markdown.trim(), `${locale}: ${symbol.signature} lost its body`)
    assert.equal(entry.tags.length, symbol.tags.length)
    entry.tags.forEach((tag, index) => {
      assert.equal(tag.name, symbol.tags[index].name)
      assert.equal(tag.subject, symbol.tags[index].subject)
      assert.ok(!symbol.tags[index].content || tag.content.trim(), `${locale}: ${symbol.signature} lost a tag`)
    })
  }
}
assert.match(localizedDocumentation(command, 'en', translations).markdown, /^A command\./)
assert.match(localizedDocumentation(command, 'zh', translations).tags.find(tag => tag.name === 'constructor').content, /创建空的 Command/)
const print = catalogs['mcfpp-lang'].symbols.find(symbol => symbol.name === 'print')
assert.match(localizedDocumentation(print, 'en', translations).markdown, /^Prints/)
const analysis = loadSnippetAnalysis(fileURLToPath(new URL('../docs/assets/api-analysis/kotlin.json', import.meta.url)))
const semantic = await createMarkdownRenderer(docs, {
  languages: [grammar], codeTransformers: [transformerApiHover(catalogs, { translations, analysis })],
})
const prepared = source => semantic.render(`~~~kotlin api=kotlin-mni\n${source}\n~~~`)
const chinese = html => [...html.matchAll(/data-mcfpp-api-zh="([^"]*)"/g)].map(match => decoder(match[1]))
for (const [source, type] of [['literal(0)', 'Int'], ['literal(0xff)', 'Int'], ['literal(1.0f)', 'Float'], ['literal(true)', 'Boolean'], ['literal("hello")', 'String']]) {
  const rendered = prepared(source)
  assert.match(rendered, /data-mcfpp-api-resolution="syntax"/)
  assert.equal(payloads(rendered)[0].match(/mcfpp-api-declaration/g).length, 1, source)
  assert.match(payloads(rendered)[0], new RegExp('value: ' + type))
}
html = prepared('@MNIMacro(normalParams = ["int"], returnType = "int")\nfun example() {}')
assert.equal(payloads(html).length, 3)
assert.ok(payloads(html).every(body => (body.match(/mcfpp-api-declaration/g) ?? []).length === 1), 'named arguments belong to their annotation')
assert.match(chinese(html)[0], /描述在编译期展开 MCFPP 宏/)
assert.match(chinese(html)[0], /注解类/)
assert.match(chinese(html)[1], /不包含 MacroContext/)
assert.match(payloads(html)[0], /Describes a public static JVM method/)
assert.match(prepared('@MNIFunction(`override` = true)\nfun example() {}'), /data-mcfpp-api-name="override"[^>]*data-mcfpp-api-count="1"/)
assert.match(prepared('import top.mcfpp.annotations.MNIMacro as Macro\n@Macro(normalParams = ["int"])\nfun example() {}'), /data-mcfpp-api-name="Macro"[^>]*data-mcfpp-api-count="1"/)
assert.equal(payloads(prepared('fun example(literal: (Int) -> Int) { literal(0) }')).length, 0, 'local function parameters shadow catalog names')
assert.equal(payloads(prepared('val text = "literal"\n// literal(0)')).length, 0, 'local declaration names are not API references')
assert.equal(payloads(prepared('literal()')).length, 0, 'missing required argument has no applicable catalog candidate')
assert.equal(payloads(prepared('literal(unknown)'))[0].match(/mcfpp-api-declaration/g).length, 4, 'unknown types retain candidates')
assert.equal(payloads(prepared('fun example(local: Local<IntT>) { local.value }'))[1].match(/mcfpp-api-declaration/g).length, 1, 'Local inherits Ref for extension receiver filtering')
assert.ok(payloads(prepared('fun <T> example(input: T) { input.value }')).length > 0, 'an unknown generic receiver keeps candidates')
html = prepared('fun example(context: MacroContext) { context.quote.expression(context.types().intType()) { yield(literal(0)) } }')
assert.ok(payloads(html).find(body => body.includes('fun &lt;T&gt; expression')).includes('KotlinQuote.expression'), 'known receiver chains select the Kotlin service')
const native = kotlin.symbols.find(symbol => symbol.name === 'MNIFunction' && !symbol.owner)
assert.match(localizedDocumentation(native, 'en', translations).markdown, /^Registers a public static JVM method/)
assert.match(localizedDocumentation(literal, 'zh-CN', translations).markdown, /创建 MCFPP int 字面量/)
assert.equal(localizedDocumentation({ ...literal, markdown: 'Updated source' }, 'zh', translations).markdown, 'Updated source', 'stale translations fall back to source')
const tagged = { ...literal, tags: [{ name: 'return', content: 'Original' }] }
assert.equal(localizedDocumentation(tagged, 'zh', { zh: { [tagged.documentationKey]: { sourceHash: documentationHash(tagged), tags: [{ name: 'return', content: '译文' }] } } }).tags[0].content, '译文')
assert.equal(new Set(kotlin.symbols.map(symbol => symbol.documentationKey)).size, kotlin.symbols.length)
console.log('API hover rendering passed: catalogs, locale content/fallback, syntax candidates, annotations, aliases, scopes, overloads, receivers, Markdown, and escaping.')
