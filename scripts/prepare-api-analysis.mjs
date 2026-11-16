import { mkdir, readFile, readdir, writeFile, rename } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import MarkdownIt from 'markdown-it'
import { snippetKey } from '../docs/.vitepress/components/api-hover/analysis.mjs'

const compiler = fileURLToPath(new URL('../../MCFPP/', import.meta.url))
const docs = fileURLToPath(new URL('../docs/', import.meta.url))
const parser = new MarkdownIt()
const snippets = new Map()
function add(source) {
  source = source.replace(/\r\n?/g, '\n').trimEnd()
  const key = snippetKey(source)
  snippets.set(key, { key, source })
}
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await collect(path)
    else if (entry.name.endsWith('.md')) {
      for (const token of parser.parse(await readFile(path, 'utf8'), {}))
        if (token.type === 'fence' && /^(?:kotlin|kt)\s+.*\bapi(?:=|\s|$)/.test(token.info)) add(token.content)
    }
  }
}
await collect(join(docs, 'zh'))
await collect(join(docs, 'en'))
const fixtures = JSON.parse(await readFile(new URL('../tests/fixtures/api-analysis.json', import.meta.url), 'utf8'))
for (const source of fixtures) add(source)
const output = join(compiler, 'build/docs')
await mkdir(output, { recursive: true })
await writeFile(join(output, 'kotlin-snippets-input.json'), JSON.stringify({ schemaVersion: 1, snippets: [...snippets.values()] }))
if (process.platform === 'win32') execFileSync('cmd.exe', ['/d', '/s', '/c', 'gradlew.bat analyzeKotlinApiSnippets --console=plain -q'], { cwd: compiler, stdio: 'inherit' })
else execFileSync('./gradlew', ['analyzeKotlinApiSnippets', '--console=plain', '-q'], { cwd: compiler, stdio: 'inherit' })
const analysis = JSON.parse(await readFile(join(output, 'kotlin-snippets-analysis.json'), 'utf8'))
const destination = join(docs, 'assets/api-analysis/kotlin.json')
await mkdir(join(docs, 'assets/api-analysis'), { recursive: true })
await writeFile(`${destination}.tmp`, JSON.stringify(analysis, null, 2) + '\n')
await rename(`${destination}.tmp`, destination)
console.log(`Prepared ${analysis.snippets.length} snippets (${analysis.snippets.filter(snippet => !snippet.complete).length} keep name candidates because of syntax errors).`)
