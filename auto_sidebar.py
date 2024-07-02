import os
import re
import json
import csv

# 从Markdown内容中提取第一个H1标题
def extract_title(md_content):
    match = re.search(r'^#\s+(.*)', md_content, re.MULTILINE)
    if match:
        return match.group(1)
    return None

# 生成侧边栏结构
def generate_sidebar_structure(base_path, title: dict, language='zh'):
    # 初始化侧边栏结构
    path = f"/{language}/quickstart/"
    sidebar = { f"{path}" : []}
    # 遍历指定目录下的所有文件
    for root, dirs, files in os.walk(base_path):
        for file in files:
            if file.endswith(".md"):  # 筛选Markdown文件
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as md_file:
                    content = md_file.read()
                    title = extract_title(content)  # 提取标题
                    if title:
                        # 生成相对路径链接
                        relative_path = os.path.relpath(file_path, base_path).replace('\\', '/')
                        link = f"{path}{relative_path[:-3]}"  # 移除.md扩展名
                        # 获取分类名称
                        category = os.path.basename(os.path.dirname(file_path))[2:]
                        # 查找或创建分类条目
                        if not title_dict.keys().__contains__(category):
                            continue
                        category_entry = next((item for item in sidebar[path] if item["text"] == title_dict[category]), None)
                        if not category_entry:
                            category_entry = {"text": title_dict[category], "items": []}
                            sidebar[path].append(category_entry)
                        # 添加链接到分类条目
                        category_entry["items"].append({"text": title, "link": link})
    return sidebar

# 将侧边栏结构写入TypeScript文件，键名不带引号
def write_sidebar_ts(sidebar, output_file):
    def dict_to_ts(obj, indent=0):
        """递归地将字典转换为TypeScript对象字面量字符串，特定键名不带引号"""
        ts_str = "{\n"
        indent_str = "    " * (indent + 1)
        for k, v in obj.items():
            # 检查键名是否为特定的几个，如果是，则不使用json.dumps
            if k in ["text", "item", "link"]:
                key_str = k
            else:
                key_str = json.dumps(k, ensure_ascii=False)
            
            if isinstance(v, dict):
                v_str = dict_to_ts(v, indent + 1)
            elif isinstance(v, list):
                v_str = "[\n" + ",\n".join([indent_str + "    " + dict_to_ts(item, indent + 2) for item in v]) + "\n" + indent_str + "]"
            else:
                v_str = json.dumps(v, ensure_ascii=False)
            ts_str += f"{indent_str}{key_str}: {v_str},\n"
        ts_str += "    " * indent + "}"
        return ts_str

    sidebar_ts_content = f"""import {{ DefaultTheme }} from 'vitepress';

export const sidebar: DefaultTheme.Sidebar = {dict_to_ts(sidebar, 0)};
"""
    with open(output_file, 'w', encoding='utf-8') as ts_file:
        ts_file.write(sidebar_ts_content)

# 指定Markdown文件所在目录和输出文件路径
output_file = 'docs/.vitepress/sidebar.ts'
# 读取csv文件获取标题。第一行为文件夹名，第二行是中文标题，第三行是英文标题
with open('titles.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    title = [row for row in reader]
    csvfile.close()
# 生成键值对
title_dict = {}
for i in range(len(title[0])):
    title_dict[title[0][i]] = title[1][i]
# 生成侧边栏结构并写入文件
sidebar = generate_sidebar_structure('docs/zh/quickstart', title_dict, 'zh')
#英文
for i in range(len(title[0])):
    title_dict[title[0][i]] = title[2][i]
en_sidebar = generate_sidebar_structure('docs/en/quickstart', title_dict, 'en')
#合并
for key in en_sidebar:
    sidebar[key] = en_sidebar[key]
write_sidebar_ts(sidebar, output_file)