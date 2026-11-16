import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

export function snippetKey(source) {
  return createHash('sha256').update(source.replace(/\r\n?/g, '\n').trimEnd()).digest('hex')
}

export function loadSnippetAnalysis(path) {
  const model = JSON.parse(readFileSync(path, 'utf8'))
  if (model.schemaVersion !== 1 || !Array.isArray(model.snippets)) throw new Error('Unsupported Kotlin snippet analysis schema')
  return new Map(model.snippets.map(snippet => [snippet.key, snippet]))
}

const typeName = type => type?.replace(/\?/g, '').split('<')[0].split('.').at(-1).trim()
const classifiers = new Set(['class', 'interface', 'enum', 'object', 'annotation', 'typealias'])
const primitive = new Set(['Boolean', 'Char', 'String', 'Int', 'Long', 'Short', 'Byte', 'Float', 'Double', 'UInt', 'ULong'])

/** Conservative filtering of parser facts. Unknown types never select a guessed overload. */
export function syntaxCandidates(candidates, fact, byName, bindings = {}) {
  if (!fact || fact.shadowed || fact.role === 'argument') return []
  const fq = symbol => `${symbol.namespace}.${symbol.owner ? `${symbol.owner}.` : ''}${symbol.name}`
  function ancestors(type, seen = new Set()) {
    const name = typeName(type)
    if (!name || seen.has(name)) return seen
    seen.add(name)
    for (const symbol of byName.get(name)?.values() ?? [])
      if (classifiers.has(symbol.kind)) for (const parent of symbol.superTypes ?? []) ancestors(parent, seen)
    return seen
  }
  function receiverMatches(symbol, receiver) {
    if (!receiver) return true
    const actual = typeName(receiver)
    if (!primitive.has(actual) && ![...(byName.get(actual)?.values() ?? [])].some(symbol => classifiers.has(symbol.kind))) return true
    const types = ancestors(receiver)
    if (symbol.receiver) {
      const expected = typeName(symbol.receiver)
      if (!primitive.has(expected) && ![...(byName.get(expected)?.values() ?? [])].some(symbol => classifiers.has(symbol.kind))) return true
      return types.has(expected)
    }
    return types.has(symbol.owner?.split('.')[0])
  }
  function argumentsMatch(symbol, args) {
    if (args.some(arg => arg.spread)) return true
    const params = symbol.parameters ?? []
    if (args.length < params.filter(param => param.defaultValue == null && !param.vararg).length) return false
    if (!params.some(param => param.vararg) && args.length > params.length) return false
    let position = 0
    const assigned = new Set()
    for (const argument of args) {
      const index = argument.name ? params.findIndex(param => param.name === argument.name) : Math.min(position++, params.length - 1)
      const parameter = params[index]
      if (!parameter || (assigned.has(index) && !parameter.vararg)) return false
      assigned.add(index)
      const expected = typeName(parameter.type)
      const actual = typeName(infer(argument.expression))
      if (primitive.has(expected) && primitive.has(actual) && expected !== actual) {
        if (!(argument.expression?.integer && ['Int', 'Long', 'Short', 'Byte'].includes(expected))) return false
      }
    }
    return params.every((param, index) => assigned.has(index) || param.vararg || param.defaultValue != null)
  }
  function members(name, receiver, call) {
    return [...(byName.get(name)?.values() ?? [])].filter(symbol =>
      (call ? symbol.kind === 'function' || classifiers.has(symbol.kind) : symbol.kind === 'property' || classifiers.has(symbol.kind)) &&
      receiverMatches(symbol, receiver) && (!call || argumentsMatch(symbol, call.arguments ?? [])))
  }
  function resultType(symbols) {
    const types = [...new Set(symbols.map(symbol => classifiers.has(symbol.kind) ? symbol.name : symbol.returnType).filter(Boolean))]
    return types.length === 1 ? types[0] : undefined
  }
  function infer(expression, receiver) {
    if (!expression) return undefined
    if (expression.type) return expression.type
    if (expression.kind === 'name') {
      if (bindings[expression.name]) return bindings[expression.name]
      if (expression.local) return undefined
      return resultType(members(expression.qualifiedName?.split('.').at(-1) ?? expression.name, receiver))
    }
    if (expression.kind === 'qualified') return infer(expression.selector, infer(expression.receiver))
    if (expression.kind === 'call') {
      const callee = expression.callee
      if (callee?.kind === 'name') return resultType(members(callee.qualifiedName?.split('.').at(-1) ?? callee.name, receiver, expression))
    }
    return undefined
  }
  if (fact.role === 'annotation-parameter') return candidates.filter(symbol => {
    const owner = fact.annotation?.split('.').at(-1)
    return symbol.kind === 'property' && symbol.owner === owner &&
      (!fact.annotation?.includes('.') || `${symbol.namespace}.${symbol.owner}` === fact.annotation)
  })
  if (fact.role === 'annotation') return candidates.filter(symbol => symbol.kind === 'annotation' && (!fact.qualifiedName || fq(symbol) === fact.qualifiedName))
  if (fact.role === 'type') return candidates.filter(symbol => classifiers.has(symbol.kind) && (!fact.qualifiedName || fq(symbol) === fact.qualifiedName))
  const receiver = infer(fact.receiver)
  return candidates.filter(symbol =>
    (fact.role === 'call' ? symbol.kind === 'function' || classifiers.has(symbol.kind) : symbol.kind === 'property' || classifiers.has(symbol.kind)) &&
    (!fact.qualifiedName || fq(symbol) === fact.qualifiedName) && receiverMatches(symbol, receiver) &&
    (!fact.call || argumentsMatch(symbol, fact.call.arguments ?? [])))
}
