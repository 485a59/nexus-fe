# 教学资源管理系统

一个基于 Vue 3 + TypeScript + Element Plus 的现代化教学资源管理系统。

## 功能特点

### 文件管理
- 支持文件上传、下载、预览
- 支持文件夹创建、删除、重命名
- 支持文件拖拽上传
- 支持大文件分片上传
- 支持文件类型筛选
- 支持列表/网格视图切换
- 支持文件移动和复制
- 支持回收站功能

### 教材管理
- 支持教材信息录入和管理
- 支持教材文件上传和下载
- 支持教材分类和搜索
- 支持教材预览
- 完整的教材元数据管理

### 文件分享
- 支持文件分享链接生成
- 支持分享链接密码保护
- 支持分享链接有效期设置
- 支持分享记录管理

## 技术栈

- 前端框架：Vue 3
- 开发语言：TypeScript
- UI 框架：Element Plus
- 构建工具：Vite
- 状态管理：Pinia
- HTTP 客户端：Axios
- 文件处理：SparkMD5
- 日期处理：Day.js

## 项目结构
```
src/
├── api/ # API 接口
├── assets/ # 静态资源
├── components/ # 公共组件
├── router/ # 路由配置
├── store/ # 状态管理
├── styles/ # 全局样式
├── utils/ # 工具函数
└── views/ # 页面组件
├── content/ # 内容管理
│ └── textbook/ # 教材管理
└── disk/ # 网盘管理
```


## 开发指南

### 环境要求
- Node.js >= 16
- npm >= 7

### 安装依赖
```bash
npm pnpm
pnpm install
```

### 开发环境运行
```bash
pnpm run dev
```

### 生产环境构建
```bash
pnpm build
```


## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE)
