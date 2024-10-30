import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'

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

  vite: {
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          dokka: '/mcfppdocs/index.html'
        }
      }
    }
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
        ]
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
  }
})
