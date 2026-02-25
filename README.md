# 羊了个羊（微信小程序轻量版）

一个可直接导入微信开发者工具运行的「羊了个羊」风格小游戏。

## 功能

- 6x6 卡片堆叠棋盘（每格最多 3 层）。
- 点击最上层卡片进入下方槽位。
- 槽位中同类达到 3 个会自动消除。
- 槽位达到 7 个仍未消除则失败。
- 所有卡片消除后通关。
- 提供一次撤回机会和一键重开。

## 本地运行

1. 打开 **微信开发者工具**。
2. 选择“导入项目”。
3. 项目目录选择当前仓库根目录。
4. `AppID` 可使用 `touristappid`（已在 `project.config.json` 中配置）。
5. 导入后直接编译运行。

## 目录结构

```text
.
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── sitemap.json
└── pages
    └── index
        ├── index.js
        ├── index.json
        ├── index.wxml
        └── index.wxss
```
