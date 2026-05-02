@echo off
cd /d %~dp0
start http://localhost:3333
npm run dev
