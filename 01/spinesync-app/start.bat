@echo off
chcp 65001 >nul
cd /d %~dp0
echo 正在启动 脊智健 SpineSync ...
npm start
if errorlevel 1 (
  echo.
  echo 启动失败：请确认已执行过 npm install（首次使用需联网安装依赖）。
  pause
)
