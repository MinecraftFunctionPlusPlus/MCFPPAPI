import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join, resolve } from 'node:path'
import { validateDocumentation } from '../docs/.vitepress/components/api-hover/transformer.mjs'

const [source, name = 'library', ...extra] = process.argv.slice(2)
if (!source || extra.length || !/^[\w-]+$/.test(name)) {
  console.error('Usage: pnpm docs:api <mcfpp-doc-output/docs.json> [catalog-name]')
  process.exitCode = 1
} else {
  const input = resolve(source)
  const model = validateDocumentation(JSON.parse(await readFile(input, 'utf8')), input)
  const directory = fileURLToPath(new URL('../docs/assets/api/', import.meta.url))
  await mkdir(directory, { recursive: true })
  const destination = join(directory, `${name}.json`)
  const temporary = `${destination}.tmp`
  await writeFile(temporary, `${JSON.stringify(model, null, 2)}\n`)
  await rename(temporary, destination)
  console.log(`Imported ${model.symbols.length} declarations as api=${name}`)
}
