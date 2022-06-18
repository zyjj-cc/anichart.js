const config: import("vitepress").UserConfig = {
  lang: "en-US",
  title: "Anichart.js",
  base: "/anichart.js/",
  description: "Easily create data visualization animated video.",
  themeConfig: {
    logo: "/img/logo.png",
    nav: [
      { text: "Guide", link: "/guide/what-is-anichart" },
      { text: "Config", link: "/config/bar" },
      { text: "Gallery", link: "/gallery" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Jannchie/anichart.js" },
    ],
    lastUpdated: "Last Updated",
    smoothScroll: true,
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          collapsible: true,
          items: [
            { text: "What is anichart?", link: "/guide/what-is-anichart" },
            { text: "Getting started", link: "/guide/getting-started" },
            { text: "Basic bar chart example", link: "/guide/basic-bar-chart" },
            { text: "Render the chart", link: "/guide/render-the-chart" },
          ],
        },
      ],
      "/config/": [
        {
          text: "Charts",
          collapsible: true,
          items: [
            { text: "Base charts", link: "/config/base" },
            { text: "Bar charts", link: "/config/bar" },
            { text: "Line charts", link: "/config/line" },
            { text: "Pie charts", link: "/config/pie" },
            { text: "Map charts", link: "/config/map" },
          ],
        },
      ],
      "/gallery": [
        {
          text: "Bar Charts",
          collapsible: true,
          items: [],
        },
        {
          text: "Line Charts",
          collapsible: true,
          items: [],
        },
        {
          text: "Map Charts",
          collapsible: true,
          items: [],
        },
        {
          text: "Pie Charts",
          collapsible: true,
          items: [],
        },
      ],
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © 2019-${new Date().getFullYear()} Jianqi Pan`,
    },
  },
};
export default config;
