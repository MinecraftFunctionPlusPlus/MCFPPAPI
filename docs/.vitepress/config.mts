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
      { text: 'Examples', link: '/markdown-examples' }
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
      link: '/zh/'
    },
    en : {
      label: 'English',
      lang: 'en',
      link: '/en/'
    }
  }
})
