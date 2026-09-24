/* 构建辅助：把工作区根目录的 jizhijian.html 同步到本应用目录（打包时随 asar 一起携带） */
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "jizhijian.html");
const dst = path.join(__dirname, "jizhijian.html");

if (!fs.existsSync(src)) {
  console.error("源文件不存在: " + src);
  process.exit(1);
}
fs.copyFileSync(src, dst);
console.log("已同步网页 -> " + dst + " (" + fs.statSync(dst).size + " bytes)");
