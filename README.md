# 旅游团预定微信小程序

一个可直接导入微信开发者工具的示例小程序，支持：

- 旅游团列表浏览与关键词搜索
- 行程详情查看
- 填写联系人信息并提交预定
- 本地缓存订单数据（`wx.setStorageSync`）

## 项目结构

- `app.*`: 小程序入口与全局样式
- `data/tours.js`: 旅游团静态数据
- `pages/index`: 列表页
- `pages/tour`: 行程详情页
- `pages/booking`: 预定表单页
- `utils/storage.js`: 订单存储工具

## 使用方式

1. 打开微信开发者工具。
2. 选择“导入项目”，目录指向本仓库。
3. 补全你自己的 `project.config.json`（本仓库未提交该文件）。
4. 编译后即可在模拟器中体验预定流程。

## 校验说明

仓库内执行过以下基础检查：

- JavaScript 语法检查：`node --check`（针对 `app.js`、各页面脚本、工具脚本）
- JSON 解析检查：`node -e` 读取并解析 `app.json` 与各页面 JSON 配置
