import { BarChart } from "./../../src/core/chart/BarChart";
const config: import("vitepress").UserConfig = {
  lang: "en-US",
  title: "Anichart.js",
  description: "Easily create data visualization animated video.",
  themeConfig: {
    logo:
      "https://raw.githubusercontent.com/Jannchie/anichart.js/master/public/image/ANI.png",
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
          ],
        },
      ],
      "/config/": [
        {
          text: "Charts",
          collapsible: true,
          items: [
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
      ],
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: `Copyright © 2019-${new Date().getFullYear()} Jianqi Pan`,
    },
  },
};
export default config;
