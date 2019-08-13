module.exports = {
  siteName: 'AntD Admin', // 配置站点名称，应用到登录框，侧边栏顶部的标题文字显示。
  copyright: 'Ant Design Admin  ©2019 zuiidea', // 配置版权声明，应用到登录页、Primay布局底部。
  logoPath: '/logo.svg', // 配置站点 Logo，应用到登录框，侧边栏顶部的 Logo 显示。
  apiPrefix: '/api/v1', // 配置项目中接口的前缀，接口相关文档可查看 接口配置
  fixedHeader: true, // sticky primary layout header

  /* Layout configuration, specify which layout to use for route. */
  // 配置哪些路由使用哪种布局，未指定路由使用默认布局 Public，项目中目前有 Primary 和 Public 两种布局，
  layouts: [
    {
      name: 'primary',
      include: [/.*/],
      exclude: [/(\/(en|zh))*\/login/],
    },
  ],

  /* I18n configuration, `languages` and `defaultLanguage` are required currently. */
  i18n: {
    /* Countrys flags: https://www.flaticon.com/packs/countrys-flags */
    languages: [
      {
        key: 'pt-br',
        title: 'Português',
        flag: '/portugal.svg',
      },
      {
        key: 'en',
        title: 'English',
        flag: '/america.svg',
      },
      {
        key: 'zh',
        title: '中文',
        flag: '/china.svg',
      },
    ],
    defaultLanguage: 'en',
  },
}





/**
 理解：config.js为统一的全局配置文件；





 */