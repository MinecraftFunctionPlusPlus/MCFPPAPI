export interface HighlightToken {
  text: string;
  kind?: string;
}

// 与 docs/assets/lang/mcfpp.json 的基础词法颜色保持一致；此处不承担语法检查。
// @ts-ignore
const keywords = new Set(
  `
  if else while for do try store execute break continue return namespace import
  typealias data object enum func constructor var get set operator extends native
  concrete final public protected private override abstract impl const external
  inline global in out as from this super
`.split(/\s+/),
);

// @ts-ignore
const types = new Set(
  `
  int entity bool byte short long float double selector string text nbt any type
  Type void list ImmutableList map dict ByteArray IntArray LongArray ScoreRef NBTRef
`.split(/\s+/),
);

// 注释和字符串优先匹配，使其中的关键词保持原色；允许尚未闭合的输入。
const tokens =
  /(?<comment>\/\/[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$))|(?<string>"""[\s\S]*?(?:"""|$)|"(?:\\[^\r\n]|[^"\\\r\n])*(?:"|$)|'(?:\\[^\r\n]|[^'\\\r\n])*(?:'|$))|(?<number>\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[bBsSlLfFdD]?)\b)|(?<annotation>@[\p{L}_][\p{L}\p{N}_]*)|(?<word>[\p{L}_][\p{L}\p{N}_]*)/gu;

function wordKind(word: string, following: string): string | undefined {
  if (keywords.has(word)) return "keyword";
  if (types.has(word) || /^vec\d*$/.test(word)) return "type";
  if (/^(true|false|null)$/.test(word)) return "literal";
  if (/^[ \t]*\(/.test(following)) return "function";
  return undefined;
}

/** 返回文本片段，由 Vue 插值转义；源码不会作为 HTML 注入页面。 */
export function highlightSource(source: string): HighlightToken[] {
  const result: HighlightToken[] = [];
  let offset = 0;

  for (const match of source.matchAll(tokens)) {
    const start = match.index;
    if (start > offset) result.push({ text: source.slice(offset, start) });
    const groups = match.groups ?? {};
    let kind = Object.keys(groups).find((name) => groups[name] !== undefined);
    if (kind === "word")
      kind = wordKind(match[0], source.slice(start + match[0].length));
    result.push({ text: match[0], kind });
    offset = start + match[0].length;
  }

  // 多留一行，让文本框末尾的空行也能在镜像中滚动到相同位置。
  result.push({ text: `${source.slice(offset)}\n` });
  return result;
}
