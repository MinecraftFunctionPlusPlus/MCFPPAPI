import os
import re

def escape_quotes(text: str) -> str:
    """
    转义字符串中的双引号
    
    Args:
        text: 需要转义的文本
    
    Returns:
        转义后的文本
    """
    return text.replace('"', '\\"')

def remove_or_replace_badge_tags(text: str) -> str:
    """
    移除或替换标题中的 <Badge> 标签
    
    Args:
        text: 包含 Badge 标签的文本
    
    Returns:
        处理后的文本
    """
    # 移除所有的 <Badge> 标签，并在末尾添加一个 *
    # 使用正则表达式匹配 <Badge> 标签
    badge_pattern = r'<Badge[^>]*>[^<]*</Badge>'
    if re.search(badge_pattern, text):
        # 移除所有 Badge 标签
        cleaned_text = re.sub(badge_pattern, '', text)
        # 清理多余的空格
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
        # 添加星号标记
        return f"{cleaned_text}*"
    return text

def generate_sidebar(base_path: str, lang: str) -> list:
    """
    根据指定语言路径下的文件结构生成侧边栏配置
    
    Args:
        base_path: 文档根路径
        lang: 语言代码 ('zh' 或 'en')
    
    Returns:
        侧边栏配置列表
    """
    sidebar_items = []
    quickstart_path = os.path.join(base_path, lang, 'quickstart')
    
    # 按章节顺序处理文件夹
    if os.path.exists(quickstart_path):
        chapters = sorted(os.listdir(quickstart_path))
        
        for chapter in chapters:
            chapter_path = os.path.join(quickstart_path, chapter)
            if os.path.isdir(chapter_path):
                # 提取章节信息
                chapter_info = extract_chapter_info(chapter_path, lang)
                if chapter_info:
                    sidebar_items.append(chapter_info)
    
    return sidebar_items

def extract_chapter_info(chapter_path: str, lang: str) -> dict:
    """
    提取章节信息，包括章节标题和子项
    
    Args:
        chapter_path: 章节路径
        lang: 语言代码
    
    Returns:
        章节信息字典
    """
    # 获取章节编号和名称
    chapter_name = os.path.basename(chapter_path)
    chapter_num = chapter_name.split('-')[0] if '-' in chapter_name else chapter_name
    
    # 获取章节下的所有文件
    files = sorted([f for f in os.listdir(chapter_path) 
                   if f.endswith('.md') and not f.startswith('index')])
    
    if not files:
        return None
    
    # 获取章节标题（从第一个文件中提取）
    first_file = files[0]
    chapter_title = extract_title_from_file(os.path.join(chapter_path, first_file), lang)
    
    # 处理 Badge 标签
    chapter_title = remove_or_replace_badge_tags(chapter_title)
    
    # 构建子项
    items = []
    for file in files:
        file_path = os.path.join(chapter_path, file)
        title = extract_title_from_file(file_path, lang)
        link = f"/{lang}/quickstart/{chapter_name}/{file.replace('.md', '')}"
        
        # 处理 Badge 标签
        title = remove_or_replace_badge_tags(title)
        
        # 转义标题中的双引号
        title = escape_quotes(title)
        
        items.append({"text": title, "link": link})
    
    # 转义章节标题中的双引号
    chapter_title = escape_quotes(chapter_title)
    
    return {
        "text": chapter_title,
        "items": items
    }

def extract_title_from_file(file_path: str, lang: str) -> str:
    """
    从Markdown文件中提取标题
    
    Args:
        file_path: 文件路径
        lang: 语言代码
    
    Returns:
        提取的标题
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 查找第一个标题（以#开头的行）
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        if title_match:
            return title_match.group(1).strip()
    except Exception:
        pass
    
    # 如果无法提取标题，则使用文件名
    filename = os.path.basename(file_path).replace('.md', '')
    return filename

def generate_sidebar_ts(base_path: str, output_path: str):
    """
    生成完整的sidebar.ts文件
    
    Args:
        base_path: 文档根路径
        output_path: 输出文件路径
    """
    # 生成中英文侧边栏
    zh_sidebar = generate_sidebar(base_path, 'zh')
    en_sidebar = generate_sidebar(base_path, 'en')
    
    # 构建TypeScript代码
    ts_code = '''import { DefaultTheme } from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = {
    "/zh/quickstart/": [
'''
    
    # 添加中文侧边栏
    for item in zh_sidebar:
        ts_code += '        {\n'
        ts_code += f'            text: "{item["text"]}",\n'
        ts_code += '            "items": [\n'
        
        for sub_item in item["items"]:
            ts_code += f'                {{\n                    text: "{sub_item["text"]}",\n                    link: "{sub_item["link"]}",\n                }},\n'
        
        ts_code += '            ],\n'
        ts_code += '        },\n'
    
    ts_code += '    ],\n'
    ts_code += '    "/en/quickstart/": [\n'
    
    # 添加英文侧边栏
    for item in en_sidebar:
        ts_code += '        {\n'
        ts_code += f'            text: "{item["text"]}",\n'
        ts_code += '            "items": [\n'
        
        for sub_item in item["items"]:
            ts_code += f'                {{\n                    text: "{sub_item["text"]}",\n                    link: "{sub_item["link"]}",\n                }},\n'
        
        ts_code += '            ],\n'
        ts_code += '        },\n'
    
    ts_code += '    ],\n'
    ts_code += '};\n'
    
    # 写入文件
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(ts_code)

# 使用示例
if __name__ == "__main__":
    # 设置文档根目录路径
    docs_path = "docs"  # 根据实际情况调整路径
    
    # 生成sidebar.ts
    generate_sidebar_ts(docs_path, "docs/.vitepress/sidebar.ts")
    print("sidebar.ts 文件已生成")