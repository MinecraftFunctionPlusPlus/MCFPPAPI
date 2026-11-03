import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { createMarkdownRenderer } from 'vitepress'

const docsDir = fileURLToPath(new URL('../docs/', import.meta.url))
const grammarPath = process.env.MCFPP_GRAMMAR ?? join(docsDir, 'assets/lang/mcfpp.json')
const grammar = { ...JSON.parse(await readFile(grammarPath, 'utf8')), name: 'mcfpp' }
let highlighter
const markdown = await createMarkdownRenderer(docsDir, {
  languages: [grammar],
  shikiSetup(shiki) { highlighter = shiki }
})

// Test the actual TextMate state machine and both themes used by VitePress.
const cases = [
  {
    name: 'abstract data replaces interfaces and external forces runtime storage',
    code: 'abstract data Contract<T> { abstract func read(): T }\nabstract data Named {}\nexternal count: int = 1\nvar dynamic = 2\nvar interface = 3',
    scopes: [['abstract', 'storage.modifier'], ['data', 'keyword.declaration'], ['Contract', 'entity.name.type'], ['T>', 'entity.name.type.parameter', 0, 1], ['Named', 'entity.name.type'], ['external', 'storage.type.variable'], ['count', 'variable.other.definition']],
    absent: [['interface', 'keyword.declaration'], ['dynamic', 'storage.modifier']]
  },
  {
    name: 'declarations, generics and Unicode identifiers',
    code: 'namespace demo.tools\nimport mcfpp.minecraft:Player\nobject data 玩家 {\n  var 生命: int = 20\n  func 问候<T>(value: T): string {\n    return identity<list<int>>(value)\n  }\n}\nfunc list<int>.size(): int { return 0 }\n@Load\nconstructor()',
    scopes: [
      ['demo.tools', 'entity.name.namespace'],
      ['Player', 'entity.name.type'],
      ['玩家', 'entity.name.type'],
      ['生命', 'variable.other.definition'],
      ['问候', 'entity.name.function'],
      ['<T>', 'entity.name.type.parameter', 0, 1, 1],
      ['value:', 'variable.parameter', 0, 5],
      ['identity', 'entity.name.function'],
      ['list', 'support.type.builtin'],
      ['list', 'support.type.builtin', 1],
      ['size', 'entity.name.function'],
      ['Load', 'entity.name.function.annotation'],
      ['constructor', 'keyword.declaration']
    ]
  },
  {
    name: 'colon declarations, direct const and external, fields and readonly parameters',
    code: 'var count: int = 1\nconst limit: int = 10\nexternal score = 0\ndata Box<T, N: int, P: demo:Point> {\n  var contents: T\n  func resize<U, M: int>(size: int, SomeClass): U {}\n}\nimport var importedScore:int\nimport var spacedScore: int\nimport demo:Point as P\nvar item: demo:Point = Box<int, 3>()',
    scopes: [
      ...['count', 'limit', 'score', 'contents', 'item'].map(text => [text, 'variable.other.definition']),
      ['count:', 'punctuation.separator.annotation', 0, 1, 5],
      ['T,', 'entity.name.type.parameter', 0, 1],
      ['N:', 'variable.parameter.readonly', 0, 1],
      ['P:', 'variable.parameter.readonly', 0, 1],
      ['Point', 'entity.name.type', 0],
      ['U,', 'entity.name.type.parameter', 0, 1],
      ['M:', 'variable.parameter.readonly', 0, 1],
      ['size:', 'variable.parameter', 0, 4],
      ['SomeClass', 'entity.name.type'],
      ['demo:Point', 'punctuation.separator.namespace', 1, 1, 4],
      ['importedScore', 'variable.other.definition'],
      ['importedScore:', 'punctuation.separator.annotation', 0, 1, 13],
      ['spacedScore', 'variable.other.definition'],
      ['spacedScore:', 'punctuation.separator.annotation', 0, 1, 11]
    ],
    absent: [['SomeClass', 'entity.name.type.parameter'], ['importedScore', 'entity.name.namespace'], ['spacedScore', 'entity.name.namespace'], ['Point', 'entity.name.type.parameter']]
  },
  {
    name: 'legacy declarations stay ordinary text while casts and aliases retain as',
    code: 'var old as int = 1\nconst var oldConst: int = 1\nexternal var oldDynamic: int = 1\nfunc legacy<T as Type>(oldParam as T) {}\nvar cast: int = value as int\nimport demo:Point as P\ntypealias int as Alias\ndata View as int',
    scopes: [['cast', 'variable.other.definition'], ['as int', 'keyword.operator.word', 1, 2], ['Point', 'entity.name.type'], ['View', 'entity.name.type']],
    absent: [['old', 'variable.other.definition'], ['oldConst', 'variable.other.definition'], ['oldDynamic', 'variable.other.definition'], ['oldParam', 'variable.parameter'], ['T as', 'entity.name.type.parameter']]
  },
  {
    name: 'conditions accept optional parentheses and semicolon free statements',
    code: 'if ready { return } else if (count > 0) { count -= 1 }\nwhile active { break }\nwhile (active) { continue }\ndo { count += 1 } while count < 10\ndo { count += 1 } while (count < 10)',
    scopes: [
      ...['if', 'else', 'while', 'do', 'return', 'break', 'continue'].map(text => [text, 'keyword.control']),
      ['ready', 'variable.other.readwrite'], ['active', 'variable.other.readwrite'], ['>', 'keyword.operator'], ['10', 'constant.numeric']
    ]
  },
  {
    name: 'numbers, SNBT arrays, coordinates and range boundaries',
    code: 'var values = [1b, 2S, 3L, 0xff, 077, 1.25e-3f, 2E+4D, true, false, null]\nvar bytes = [B; 1b, 2b]\nvar ints = [I; 1, 2]\nvar longs = [L; 1L, 2L]\nvar pos = [~1.5, ^-2, ~, ^]\nvar ranges = [1..3, ..5, 7..]\nvar value2 = 3',
    scopes: [
      ...['1b', '2S', '3L', '0xff', '077', '1.25e-3f', '2E+4D'].map(text => [text, 'constant.numeric']),
      ...['true', 'false', 'null'].map(text => [text, 'constant.language']),
      ['B;', 'storage.type.array', 0, 1],
      ['I;', 'storage.type.array', 0, 1],
      ['L;', 'storage.type.array', 0, 1],
      ['~1.5', 'constant.numeric.coordinate'],
      ['^-2', 'constant.numeric.coordinate'],
      ['..', 'keyword.operator', 0],
      ['..', 'keyword.operator', 1],
      ['..', 'keyword.operator', 2]
    ],
    absent: [['value2', 'constant.numeric']]
  },
  {
    name: 'single and double quotes, escapes, and ordinary dollar text',
    code: 'var single = \'it\\\'s ${literal}\'\nvar double = "a \\"quote\\" ${literal}"\nvar unfinished = "unfinished\nvar after: int = 1',
    scopes: [
      ['literal', 'string.quoted.single', 0],
      ['literal', 'string.quoted.double', 1],
      ["\\'", 'constant.character.escape'],
      ['\\"', 'constant.character.escape'],
      ['after', 'variable.other.definition']
    ],
    absent: [['literal', 'meta.embedded.expression', 0], ['literal', 'meta.embedded.expression', 1], ['after', 'string']]
  },
  {
    name: 'multiline strings and balanced interpolation',
    code: 'var message = """first\n${format({outer: {value: 2}, quote: "}"}) + 3 + name}\nlast"""\nvar after = 4',
    scopes: [
      ['first', 'string.quoted.triple'],
      ['last', 'string.quoted.triple'],
      ['format', 'entity.name.function'],
      ['2', 'constant.numeric'],
      ['3', 'constant.numeric'],
      ['name', 'variable.other.readwrite'],
      ['after', 'variable.other.definition']
    ],
    absent: [['last', 'meta.embedded.expression'], ['after', 'string']],
    differentColors: [['first', 'format'], ['first', '2'], ['first', '3'], ['first', 'name']]
  },
  {
    name: 'commands inside function blocks, comments and division',
    code: 'func main() {\n  /// documentation\n  // comment\n  /execute as @a run say // #text true ${format({value: 2})}\n  /say literal as true ${3 + 4}\n  var quotient = 8 / 2\n}',
    scopes: [
      ['documentation', 'comment.line.documentation'],
      ['comment', 'comment.line.double-slash'],
      ['execute', 'keyword.control.command'],
      ['@a', 'variable.language.selector'],
      ['#text', 'string.unquoted.command'],
      ['literal', 'string.unquoted.command'],
      ['format', 'entity.name.function'],
      ['3', 'constant.numeric'],
      ['quotient', 'variable.other.definition'],
      ['8 / 2', 'keyword.operator', 0, 1, 2]
    ],
    absent: [
      ['#text', 'comment'],
      ['true', 'constant.language', 0],
      ['true', 'constant.language', 1],
      ['quotient', 'meta.embedded.line.mcfunction']
    ]
  },
  {
    name: 'commands interpolate even inside Minecraft JSON strings',
    code: '/tellraw @a {"text":"Hello ${format({value: 2, quote: \'}\'})}!"}\n/function #demo:tools/start\nvar after = 1',
    scopes: [
      ['tellraw', 'keyword.control.command'],
      ['Hello', 'string.quoted.double.mcfunction'],
      ['format', 'entity.name.function'],
      ['2', 'constant.numeric'],
      ['!', 'string.quoted.double.mcfunction'],
      ['#demo:tools/start', 'entity.name.function.mcfunction'],
      ['after', 'variable.other.definition']
    ],
    absent: [['after', 'meta.embedded.line.mcfunction']],
    differentColors: [['Hello', 'format'], ['Hello', '2']]
  },
  {
    name: 'multiline interpolation restores the command context',
    code: '/say ${format(\n{value: 2}\n) + name} trailing\nvar next: int = 1',
    scopes: [
      ['format', 'entity.name.function'],
      ['2', 'constant.numeric'],
      ['name', 'variable.other.readwrite'],
      ['trailing', 'string.unquoted.command'],
      ['next', 'variable.other.definition']
    ],
    absent: [['trailing', 'meta.embedded.expression'], ['next', 'meta.embedded.line.mcfunction']],
    differentColors: [['trailing', 'name']]
  },
  {
    name: 'version directives keep versions, operators and comments separate',
    code: '#if MC >= 26.3\nfunc main() {\n  #elif MC < 1.21.8\n  /say #if MC is plain text\n  #else\n  #endif\n}',
    scopes: [
      ['#if', 'keyword.control.directive', 0],
      ['MC', 'variable.language.version', 0],
      ['>=', 'keyword.operator.comparison'],
      ['26.3', 'constant.numeric.version'],
      ['#elif', 'keyword.control.directive'],
      ['1.21.8', 'constant.numeric.version'],
      ['#else', 'keyword.control.directive'],
      ['#endif', 'keyword.control.directive']
    ],
    absent: [['#if', 'keyword.control.directive', 1]]
  }
]

function locate(code, text, occurrence = 0) {
  let start = -1
  for (let i = 0; i <= occurrence; i++) start = code.indexOf(text, start + 1)
  assert.ok(start >= 0, 'Missing fixture text: ' + text)
  return start
}

function tokensFor(code, theme) {
  return highlighter.codeToTokensBase(code, {
    lang: 'mcfpp', theme, includeExplanation: true
  }).flat().flatMap(token => {
    let offset = token.offset
    return token.explanation.map(part => {
      const result = {
        start: offset,
        end: offset + part.content.length,
        scopes: part.scopes.map(scope => scope.scopeName),
        color: token.color
      }
      offset = result.end
      return result
    })
  })
}

for (const theme of ['github-light', 'github-dark']) {
  for (const fixture of cases) {
    const tokens = tokensFor(fixture.code, theme)
    const at = index => tokens.find(token => token.start <= index && index < token.end)
    for (const [text, scope, occurrence, length = text.length, shift = 0] of fixture.scopes) {
      const start = locate(fixture.code, text, occurrence) + shift
      for (let i = start; i < start + length; i++) {
        assert.ok(at(i)?.scopes.some(value => value.startsWith(scope)),
          theme + ': ' + fixture.name + ': "' + text + '" must have scope ' + scope + ' at ' + i)
      }
    }
    for (const [text, scope, occurrence] of fixture.absent ?? []) {
      const start = locate(fixture.code, text, occurrence)
      assert.ok(!at(start)?.scopes.some(value => value.startsWith(scope)),
        theme + ': ' + fixture.name + ': "' + text + '" must not have scope ' + scope)
    }
    for (const [left, right] of fixture.differentColors ?? []) {
      assert.notEqual(at(locate(fixture.code, left)).color, at(locate(fixture.code, right)).color,
        theme + ': ' + fixture.name + ': ' + left + ' and ' + right + ' must have distinct colors')
    }
  }
}

// Render the real documentation fences through VitePress as an integration check.
const fence = String.fromCharCode(96).repeat(3)
const fencePattern = new RegExp('^([ \\t]*)' + fence + 'mcfpp[^\\r\\n]*\\r?\\n([\\s\\S]*?)^\\1' + fence + '[ \\t]*$', 'gm')
let fences = 0
async function checkDirectory(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await checkDirectory(path)
    else if (entry.name.endsWith('.md')) {
      const source = await readFile(path, 'utf8')
      for (const match of source.matchAll(fencePattern)) {
        const html = markdown.render(fence + 'mcfpp\n' + match[2] + fence)
        assert.ok(html.includes('language-mcfpp') && html.includes('<span'), path + ': fence was not highlighted')
        fences++
      }
    }
  }
}
await checkDirectory(join(docsDir, 'zh'))
await checkDirectory(join(docsDir, 'en'))
assert.ok(fences > 0, 'No documentation fences found')
console.log('Passed ' + cases.length * 2 + ' highlighting scenarios and rendered ' + fences + ' documentation fences.')
