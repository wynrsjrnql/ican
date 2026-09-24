/* 脊智健 SpineSync 桌面壳
   内置本地 HTTP 服务加载同目录上级的 jizhijian.html
   （127.0.0.1 属安全上下文，摄像头 getUserMedia 可用；放行媒体权限） */
const { app, BrowserWindow, session } = require("electron");
const http = require("http");
const fs = require("fs");
const path = require("path");

const HTML_PATH = [path.join(__dirname, "jizhijian.html"), path.join(__dirname, "..", "jizhijian.html")]
  .find((p) => fs.existsSync(p));
if (!HTML_PATH) {
  console.error("未找到 jizhijian.html：请先执行 npm run sync 或在上级目录放置网页文件");
  app.quit();
}
const SMOKE = process.argv.includes("--smoke");

function startServer() {
  const html = fs.readFileSync(HTML_PATH);
  const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.end(html);
  });
  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

app.whenReady().then(async () => {
  const server = await startServer();
  const port = server.address().port;

  const ses = session.defaultSession;
  ses.setPermissionRequestHandler((wc, permission, callback) => callback(true));
  ses.setPermissionCheckHandler(() => true);

  const win = new BrowserWindow({
    width: 1180,
    height: 880,
    minWidth: 900,
    minHeight: 640,
    title: "脊智健 SpineSync · 大学生端云协同健康干预系统",
    backgroundColor: "#08120f",
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  win.setMenuBarVisibility(false);

  if (SMOKE) {
    win.webContents.once("did-finish-load", () => {
      console.log("SMOKE_OK url=" + win.webContents.getURL());
      setTimeout(() => app.quit(), 600);
    });
    win.webContents.on("did-fail-load", (e, code, desc) => {
      console.log("SMOKE_FAIL code=" + code + " desc=" + desc);
      app.quit();
    });
  }

  await win.loadURL("http://127.0.0.1:" + port + "/");
  console.log("SpineSync 已启动: http://127.0.0.1:" + port + "/");
});

app.on("window-all-closed", () => app.quit());
