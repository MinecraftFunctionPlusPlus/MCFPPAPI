import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

const mcfpp: any = {
  "name": "mcfpp",
  "scopeName": "source.mcfpp",
  "displayName": "MCFPP",
  "fileTypes": ["mcfpp"],
  "patterns": [
      {
          "name": "comment.block.documentation.mcfpp",
          "match": "#\\{.*?\\}#"
      },
      {
          "name": "comment.block.mcfpp",
          "match": "##.*?##"
      },
      {
          "name": "comment.line.mcfpp",
          "match": "#.*"
      },
      {
          "name": "keyword.control.mcfpp",
          "match": "\\b(this|super|if|else|while|for|do|try|store|as|from|execute|break|continue|return|static|extends|native|concrete|final|public|protected|private|override|abstract|impl|const|dynamic|import|inline|class|object|interface|data|func|enum|constructor|global|var|get|set|namespace|vec|int|entity|bool|float|double|selector|string|text|nbt|any|type|void|list|map|dict)\\b"
      },
      {
          "name": "constant.numeric.mcfpp",
          "match": "\\b\\d+(\\.\\d+)?\\b"
      },
      {
          "name": "string.quoted.double.mcfpp",
          "begin": "\"",
          "end": "\"",
          "patterns": [
              {
                  "name": "constant.character.escape.mcfpp",
                  "match": "\\\\."
              }
          ]
      }
  ],
  "repository": {},
  "uuid": "b12f0f30-1234-5678-9abc-ddef12345678"
}

const mcf: any = {
  "displayName": "Syntax Mcfunction",
  "name": "mcfunction",
  "scopeName": "source.mcfunction",
  "uuid": "8918dadd-8ebe-42d9-b1e9-0489ab228d9d",
  "fileTypes": [
    "mcfunction",
    "bolt"
  ],
  "patterns": [
    {
      "include": "#root"
    }
  ],
  "repository": {
    "root": {
      "patterns": [
        {
          "include": "#literals"
        },
        {
          "include": "#comments"
        },
        {
          "include": "#say"
        },
        {
          "include": "#names"
        },
        {
          "include": "#comments_inline"
        },
        {
          "include": "#subcommands"
        },
        {
          "include": "#property"
        },
        {
          "include": "#operators"
        },
        {
          "include": "#selectors"
        }
      ]
    },
    "comments": {
      "patterns": [
        {
          "applyEndPatternLast": 1,
          "begin": "^\\s*(#[>!#])(.+)$",
          "beginCaptures": {
            "1": {
              "name": "comment.block.mcfunction"
            },
            "2": {
              "name": "markup.bold.mcfunction"
            }
          },
          "captures": {
            "0": {
              "name": "comment.block.mcfunction"
            }
          },
          "end": "^(?!#)",
          "name": "meta.comments",
          "patterns": [
            {
              "include": "#comments_block"
            }
          ]
        },
        {
          "captures": {
            "0": {
              "name": "comment.line.mcfunction"
            }
          },
          "match": "^\\s*#.*$",
          "name": "meta.comments"
        }
      ]
    },
    "comments_inline": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "comment.line.mcfunction"
            }
          },
          "match": "#.*$",
          "name": "meta.comments"
        }
      ]
    },
    "comments_block": {
      "patterns": [
        {
          "applyEndPatternLast": 1,
          "begin": "^\\s*#[>!]",
          "captures": {
            "0": {
              "name": "comment.block.mcfunction"
            }
          },
          "end": "$",
          "name": "meta.comments_block",
          "patterns": [
            {
              "include": "#comments_block_emphasized"
            }
          ]
        },
        {
          "applyEndPatternLast": 1,
          "begin": "^\\s*#",
          "captures": {
            "0": {
              "name": "comment.block.mcfunction"
            }
          },
          "end": "$",
          "name": "meta.comments_block",
          "patterns": [
            {
              "include": "#comments_block_normal"
            }
          ]
        }
      ]
    },
    "comments_block_emphasized": {
      "patterns": [
        {
          "include": "#comments_block_special"
        },
        {
          "captures": {
            "0": {
              "name": "markup.bold.mcfunction"
            }
          },
          "match": "\\S+",
          "name": "meta.comments_block_emphasized"
        }
      ]
    },
    "comments_block_normal": {
      "patterns": [
        {
          "include": "#comments_block_special"
        },
        {
          "captures": {
            "0": {
              "name": "comment.block.mcfunction"
            }
          },
          "match": "\\S+",
          "name": "meta.comments_block_normal"
        },
        {
          "include": "#whitespace"
        }
      ]
    },
    "comments_block_special": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "markup.heading.mcfunction"
            }
          },
          "match": "@\\S+",
          "name": "meta.comments_block_special"
        },
        {
          "include": "#resource-name"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "[#%$][A-Za-z0-9_.#%$]+",
          "name": "meta.comments_block_special"
        }
      ]
    },
    "literals": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "constant.numeric.boolean.mcfunction"
            }
          },
          "match": "\\b(true|false|True|False)\\b",
          "name": "meta.literals"
        },
        {
          "captures": {
            "0": {
              "name": "variable.uuid.mcfunction"
            }
          },
          "match": "\\b[0-9a-fA-F]+(?:-[0-9a-fA-F]+){4}\\b",
          "name": "meta.names"
        },
        {
          "captures": {
            "0": {
              "name": "constant.numeric.float.mcfunction"
            }
          },
          "match": "[+-]?\\d*\\.?\\d+([eE]?[+-]?\\d+)?[df]?\\b",
          "name": "meta.literals"
        },
        {
          "captures": {
            "0": {
              "name": "constant.numeric.integer.mcfunction"
            }
          },
          "match": "[+-]?\\d+(b|B|L|l|s|S)?\\b",
          "name": "meta.literals"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "\\.\\.",
          "name": "meta.ellipse.literals"
        },
        {
          "applyEndPatternLast": 1,
          "begin": "\"",
          "beginCaptures": {
            "0": {
              "name": "punctuation.definition.string.begin.mcfunction"
            }
          },
          "end": "\"",
          "endCaptures": {
            "0": {
              "name": "punctuation.definition.string.end.mcfunction"
            }
          },
          "name": "string.quoted.double.mcfunction",
          "patterns": [
            {
              "include": "#literals_string-double"
            }
          ]
        },
        {
          "applyEndPatternLast": 1,
          "begin": "'",
          "beginCaptures": {
            "0": {
              "name": "punctuation.definition.string.begin.mcfunction"
            }
          },
          "end": "'",
          "endCaptures": {
            "0": {
              "name": "punctuation.definition.string.begin.mcfunction"
            }
          },
          "name": "string.quoted.single.mcfunction",
          "patterns": [
            {
              "include": "#literals_string-single"
            }
          ]
        }
      ]
    },
    "subcommands": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "entity.name.class.mcfunction"
            }
          },
          "match": "[a-z_]+",
          "name": "meta.literals"
        }
      ]
    },
    "literals_string-double": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "constant.character.escape.mcfunction"
            }
          },
          "match": "\\\\.",
          "name": "meta.literals_string-double"
        },
        {
          "captures": {
            "0": {
              "name": "constant.character.escape.mcfunction"
            }
          },
          "match": "\\\\",
          "name": "meta.literals_string-double"
        },
        {
          "include": "#macro-name"
        },
        {
          "captures": {
            "0": {
              "name": "string.quoted.double.mcfunction"
            }
          },
          "match": "[^\\\\\"]",
          "name": "meta.literals_string-double"
        }
      ]
    },
    "literals_string-single": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "constant.character.escape.mcfunction"
            }
          },
          "match": "\\\\.",
          "name": "meta.literals_string-single"
        },
        {
          "captures": {
            "0": {
              "name": "constant.character.escape.mcfunction"
            }
          },
          "match": "\\\\",
          "name": "meta.literals_string-double"
        },
        {
          "include": "#macro-name"
        },
        {
          "captures": {
            "0": {
              "name": "string.quoted.single.mcfunction"
            }
          },
          "match": "[^\\\\']",
          "name": "meta.literals_string-single"
        }
      ]
    },
    "say": {
      "patterns": [
        {
          "begin": "^(\\s*)(say)",
          "beginCaptures": {
            "1": {
              "name": "whitespace.mcfunction"
            },
            "2": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "end": "\\n",
          "name": "meta.say.mcfunction",
          "patterns": [
            {
              "captures": {
                "0": {
                  "name": "constant.character.escape.mcfunction"
                }
              },
              "match": "\\\\\\s*\\n",
              "meta": "meta.say.backslash.mcfunction"
            },
            {
              "include": "#literals_string-double"
            },
            {
              "include": "#literals_string-single"
            }
          ]
        },
        {
          "begin": "(run)(\\s+)(say)",
          "beginCaptures": {
            "1": {
              "name": "entity.name.mcfunction"
            },
            "2": {
              "name": "whitespace.mcfunction"
            },
            "3": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "end": "\\n",
          "name": "meta.say.mcfunction",
          "patterns": [
            {
              "captures": {
                "0": {
                  "name": "constant.character.escape.mcfunction"
                }
              },
              "match": "\\\\\\s*\\n",
              "meta": "meta.say.backslash.mcfunction"
            },
            {
              "include": "#literals_string-double"
            },
            {
              "include": "#literals_string-single"
            }
          ]
        }
      ]
    },
    "names": {
      "patterns": [
        {
          "captures": {
            "1": {
              "name": "whitespace.mcfunction"
            },
            "2": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "match": "^(\\s*)([a-z_]+)(?=\\s)",
          "name": "meta.names"
        },
        {
          "captures": {
            "1": {
              "name": "whitespace.mcfunction"
            },
            "2": {
              "name": "markup.italic.mcfunction"
            },
            "3": {
              "name": "whitespace.mcfunction"
            },
            "4": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "match": "^(\\s*)(\\$)( ?)([a-z_]*)",
          "name": "meta.names"
        },
        {
          "captures": {
            "1": {
              "name": "entity.name.mcfunction"
            },
            "2": {
              "name": "whitespace.mcfunction"
            },
            "3": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "match": "(run)(\\s+)([a-z_]+)",
          "name": "meta.names"
        },
        {
          "include": "#resource-name"
        },
        {
          "captures": {
            "0": {
              "name": "entity.name.mcfunction"
            }
          },
          "match": "[A-Za-z]+(?=\\W)",
          "name": "meta.names"
        },
        {
          "captures": {
            "0": {
              "name": "string.unquoted.mcfunction"
            }
          },
          "match": "[A-Za-z_][A-Za-z0-9_.#%$]*",
          "name": "meta.names"
        },
        {
          "include": "#macro-name"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "([#%$]|((?<=\\s)\\.))[A-Za-z0-9_.#%$\\-]+",
          "name": "meta.names"
        }
      ]
    },
    "macro-name": {
      "patterns": [
        {
          "captures": {
            "1": {
              "name": "punctuation.definition.template-expression.begin.mcfunction"
            },
            "2": {
              "name": "variable.other.mcfunction"
            },
            "3": {
              "name": "punctuation.definition.template-expression.end.mcfunction"
            }
          },
          "match": "(\\$\\()([A-Za-z0-9_]*)(\\))",
          "name": "meta.macro-name"
        }
      ]
    },
    "operators": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "constant.numeric.mcfunction"
            }
          },
          "match": "[~^]",
          "name": "meta.operators"
        },
        {
          "captures": {
            "0": {
              "name": "keyword.operator.mcfunction"
            }
          },
          "match": "[\\-%?!+*<>\\\\/|&=.:,;]",
          "name": "meta.operators"
        }
      ]
    },
    "property": {
      "patterns": [
        {
          "applyEndPatternLast": 1,
          "begin": "\\{",
          "captures": {
            "0": {
              "name": "punctuation.mcfunction"
            }
          },
          "end": "\\}",
          "name": "meta.property.curly",
          "patterns": [
            {
              "include": "#resource-name"
            },
            {
              "include": "#literals"
            },
            {
              "include": "#property_key"
            },
            {
              "include": "#operators"
            },
            {
              "include": "#property_value"
            },
            {
              "include": "$self"
            }
          ]
        },
        {
          "applyEndPatternLast": 1,
          "begin": "\\[",
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "end": "\\]",
          "name": "meta.property.square",
          "patterns": [
            {
              "include": "#resource-name"
            },
            {
              "include": "#literals"
            },
            {
              "include": "#property_key"
            },
            {
              "include": "#operators"
            },
            {
              "include": "#property_value"
            },
            {
              "include": "$self"
            }
          ]
        },
        {
          "applyEndPatternLast": 1,
          "begin": "\\(",
          "captures": {
            "0": {
              "name": "punctuation.mcfunction"
            }
          },
          "end": "\\)",
          "name": "meta.property.paren",
          "patterns": [
            {
              "include": "#resource-name"
            },
            {
              "include": "#literals"
            },
            {
              "include": "#property_key"
            },
            {
              "include": "#operators"
            },
            {
              "include": "#property_value"
            },
            {
              "include": "$self"
            }
          ]
        }
      ]
    },
    "property_key": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z_\\.\\-]*\\:[a-z0-9_\\.\\-/]+(?=\\s*\\=:)",
          "name": "meta.property_key"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z0-9_\\.\\-/]+",
          "name": "meta.property_key"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "[A-Za-z_]+[A-Za-z_\\-\\+]*",
          "name": "meta.property_key"
        }
      ]
    },
    "property_value": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "string.unquoted.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z_\\.\\-]*\\:[a-z0-9_\\.\\-/]+",
          "name": "meta.property_value"
        },
        {
          "captures": {
            "0": {
              "name": "string.unquoted.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z0-9_\\.\\-/]+",
          "name": "meta.property_value"
        }
      ]
    },
    "resource-name": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "entity.name.function.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z0-9_.-]*:[a-z0-9_./-]+",
          "name": "meta.resource-name"
        },
        {
          "captures": {
            "0": {
              "name": "entity.name.function.mcfunction"
            }
          },
          "match": "#?[a-z0-9_\\.\\-]+\\/[a-z0-9_\\.\\-\\/]+",
          "name": "meta.resource-name"
        }
      ]
    },
    "selectors": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "support.class.mcfunction"
            }
          },
          "match": "@[a-z]+",
          "name": "meta.selectors"
        }
      ]
    }
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MCFPP",
  description: "Change the way you develop Minecraft Datapacks",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'QuickStart', link: '/quick-start' }
    ],

    search: {
        provider: 'local',
    },

    i18nRouting:true,

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MinecraftFunctionPlusPlus/MCFPP' }
    ]
  },
  
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh',
      link: '/zh/',
      themeConfig: {
        nav: [
          { text: '主页', link: '/zh/' },
          { text: '快速开始', link: '/zh/quickstart/index' },
          { text: '文档', link: '/mcfppdocs/index.html' }
        ],
        footer: {
          message: "<a href='https://mcicp.com' title='MCICP备2024000011号' target='_blank'>MCICP备2024000011号</a>",
          copyright: "GPL-3.0 Lisenced | Copyright©2024 ProjectMCFPP"
        }
      }
    },
    en : {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'QuickStart', link: '/en/quickstart/index' },
          { text: 'Docs', link: '/mcfppdocs/index.html' }
        ]
      }
    }
  },

  markdown: {
    languages: [mcfpp, mcf],

    shikiSetup: async (shiki) => {
      await shiki.loadLanguage(mcfpp, mcf)
    }
  }
})
