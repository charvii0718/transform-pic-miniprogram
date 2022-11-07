const svgtofont = require("svgtofont");
const path = require("path");
const pkg = require("../package.json");
 
svgtofont({
  src: path.resolve(process.cwd(), "miniprogram/assets/svg"), // svg 图标目录路径
  dist: path.resolve(process.cwd(), "miniprogram/assets/fonts"), // 输出到指定目录中
  fontName: "svgtofont", // 设置字体名称
  css: true, // 生成字体文件
  startUnicode: 0xea01, // unicode的起始值，默认值为0xea01
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true
  },
  website: {
    title: "svgtofont",
    logo: "",
    version: pkg.version,
    meta: {
      description: "Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.",
      keywords: "svgtofont,TTF,EOT,WOFF,WOFF2,SVG",
      favicon: ""
    },
    footerLinks: [
      {
        title: "Font Class",
        url: "index.html"
      },
      {
        title: "Unicode",
        url: "unicode.html"
      }
    ]
  }
}).then(() => {
  console.log('done!');
});