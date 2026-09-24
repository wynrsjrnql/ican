# 01 · 脊智健 SpineSync（应用版）

> iCAN 人工智能应用创新赛道 · 大学生端云协同健康干预系统
> 端侧轻量视觉感知 × 云端多模态解构 × 混合多智能体反思审裁

面向高校宿舍微场景的具身化、低门槛、多模态健康干预平台：宿舍硬椅久坐腰椎曲度变平、食堂高糖碳水餐后脑雾、熄灯暗光用眼痉挛、考研冲刺咖啡因滥用——全部在端侧浏览器内完成视觉推理（视频不出端），云端仅做餐食解构与多智能体处方。

---

## 📁 目录结构

```
01/
├── jizhijian.html        # 核心应用（单文件，六大模块）
├── README.md             # 本说明
└── spinesync-app/        # 桌面程序工程（Electron）
    ├── package.json      #   依赖与脚本
    ├── main.js           #   桌面壳：本地 HTTP 服务 + 摄像头权限放行
    ├── build-copy.js     #   启动/打包前自动同步网页副本
    ├── start.bat         #   一键启动（开发模式）
    ├── .gitignore        #   忽略 node_modules / dist / 生成的网页副本
    └── 使用说明.txt
```

## 🚀 快速开始（三种方式）

### ① 网页版（零安装）
双击 `jizhijian.html`，用 Chrome / Edge 打开即可。
- 摄像头功能需 `HTTPS` / `localhost` / `file://` 环境（Chrome/Edge 直接双击 file:// 可用），首次请允许权限；
- 不配 API Key 时 AI 功能为离线演示模式，全部模块仍可演示。

### ② 桌面程序 · 开发模式（需 Node.js ≥ 18）
```bash
cd spinesync-app
npm install        # 首次约 2 分钟；国内网络慢可先执行：set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
npm start          # 或双击 start.bat
```
摄像头权限已由桌面壳自动放行；网页源码改动后重启应用即生效（prestart 自动同步 `../jizhijian.html`）。

### ③ 桌面程序 · 便携版 exe（免 Node.js，答辩推荐）
```bash
cd spinesync-app
npm run pack
# 产物：dist\SpineSync-win32-x64\SpineSync.exe
# 整个 SpineSync-win32-x64 文件夹可拷贝到 U 盘，双击 exe 即用
```
> 便携版整包约 268MB，超过 Git 单文件 100MB 上限，**未纳入版本库**，请用上面命令在本地生成。

## 🧩 功能速览

| 模块 | 能力 |
|---|---|
| 🧍 姿态纠偏 | MediaPipe Pose：膝内扣 / 骨盆代偿 Butt Wink / 膝超脚尖实时告警；床梯踝伸展、门框开胸拉伸、垫书坐姿校准、头颈前伸角监测 |
| 🍜 餐食解构 | 热量 / GI / GL / 嘌呤结构化输出 + 餐后脑雾预警窗口 + 食堂窗口改选指令（麻辣烫 / 黄焖鸡 / 自选称重 / 外卖） |
| 👁 护眼感知 | MediaPipe Face Mesh：EAR 眼部纵横比 + 眨眼频率疲劳判定 + 4 秒/次琥珀呼吸晕光 + 20-20-20 护眼法则 |
| ☕ 咖啡因沙盘 | 一室代谢模型浓度曲线 + 咖啡因截断时间反推 + 神经递质代偿处方（VB/镁/淡盐水 + 微觉醒指令） |
| 🧠 智能仲裁 | Nutri-Agent / Physio-Agent / Safety-Critic 三智能体 + 确定性医疗禁忌规则拦截（高尿酸+膝劳损禁深蹲跳等） |
| ⚙️ API 设置 | DeepSeek-V3 / 阿里云百炼（Qwen-VL）/ 智谱，Key 与模型按平台分别保存 |

## 🔑 API Key 配置

1. 打开应用 → 「⚙️ API 设置」→ 选择平台 → 填入 Key → 「🔗 测试连接」。
2. 平台入口：DeepSeek（`platform.deepseek.com`）、阿里云百炼（`bailian.console.aliyun.com`）、智谱（`open.bigmodel.cn`）。
3. 机制说明：同一平台下所有模型共用一把 Key；切换平台自动加载该平台自己的 Key；Key 仅保存在本机浏览器 localStorage，不上传。
4. **仓库内的代码不含任何 Key**；请勿把自己的 Key 提交到公开仓库（本项目已提供「预置 Key」代码位置，自行填写）。

## 🔒 隐私与架构

- **数据不出端**：摄像头原始视频流只在浏览器 WebAssembly/WebGL 管线内计算（MediaPipe Pose / Face Mesh），提取骨骼拓扑与眼部关键点后立即丢弃帧数据，绝不回传；
- **云端最小化**：仅文字餐食描述与脱敏餐盘照片调用 DeepSeek-V3 / Qwen-VL；
- **桌面壳**：Electron + 本地 127.0.0.1 服务（安全上下文，getUserMedia 可用），媒体权限自动放行。

## ❓ 常见问题

| 现象 | 处理 |
|---|---|
| 摄像头打不开 | 用 `localhost` / `https` 环境打开，或在桌面版中运行；系统弹窗请选择允许 |
| MediaPipe 模型加载失败 | 需联网（CDN 加载），校园网波动时重试 |
| 餐盘照片无法识别 | 需在「API 设置」配置阿里云百炼 `qwen-vl-plus`（视觉模型）；否则请补充文字描述走离线演示库 |
| 打包后无窗口 | 先执行 `npm run sync`（或 `npm run pack` 会自动同步网页副本）再打包 |

## 🗓 路线图（申报书对应章节）

4.1-4.8 已全部实现；后续规划：云端 LangGraph 决策中枢与《中国食物成分表》向量库服务化、高校食堂营养二维码联动、校医院转诊接口。
