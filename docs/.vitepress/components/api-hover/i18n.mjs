import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

export const documentationHash = symbol => createHash('sha256').update(JSON.stringify({ markdown: symbol.markdown,
  tags: symbol.tags.map(tag => ({ name: tag.name, subject: tag.subject ?? null, content: tag.content ?? '' })),
})).digest('hex')
export const localeName = locale => locale?.toLowerCase().startsWith('zh') ? 'zh' : 'en'

export function loadLocalizations(directory) {
  return Object.fromEntries(readdirSync(directory).filter(name => name.endsWith('.json')).map(name => {
    const model = JSON.parse(readFileSync(join(directory, name), 'utf8'))
    if (model.schemaVersion !== 1 || !model.symbols || !['zh', 'en'].includes(model.locale)) throw new Error(`Invalid API localization: ${name}`)
    return [model.locale, model.symbols]
  }))
}

export function localizedDocumentation(symbol, locale, translations) {
  const entry = translations[localeName(locale)]?.[symbol.documentationKey ?? symbol.id]
  if (!entry || entry.sourceHash !== documentationHash(symbol)) return symbol
  return { ...symbol, markdown: entry.markdown ?? symbol.markdown, tags: entry.tags ?? symbol.tags }
}

export function kindLabel(kind, locale) {
  if (localeName(locale) !== 'zh') return kind
  return ({ function: '函数', property: '属性', field: '字段', annotation: '注解类', class: '类', interface: '接口',
    object: '单例', enum: '枚举', 'enum-member': '枚举项', typealias: '类型别名', data: '数据模板', namespace: '命名空间', constructor: '构造函数',
    native: '原生函数', inline: '内联函数', 'const-function': '编译期函数', extension: '扩展函数', operator: '运算符' })[kind] ?? kind
}

export function tagLabel(name, locale) {
  if (localeName(locale) !== 'zh') return `@${name}`
  return ({ param: '参数', return: '返回值', receiver: '接收者', property: '属性', constructor: '构造函数',
    throws: '异常', exception: '异常', see: '参见', sample: '示例', since: '起始版本', deprecated: '已弃用', author: '作者' })[name] ?? `@${name}`
}
