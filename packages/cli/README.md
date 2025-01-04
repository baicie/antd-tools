# @baicie/antd-tools

一个用于 Ant Design 组件库的命令行工具。

## 安装

```bash
# 全局安装
npm install @baicie/antd-tools -g

# 或使用 pnpm
pnpm add -g @baicie/antd-tools

# 或使用 yarn
yarn global add @baicie/antd-tools
```

## 使用方法

安装完成后，你可以使用 `bantd` 命令来启动开发服务器：

```bash
# 在 antd 项目根目录下运行
bantd dev

# 或者简写形式
bantd
```

### 命令选项

- `-f, --force`: 强制重新生成开发环境文件
- `--help`: 显示帮助信息
- `--version`: 显示版本信息

## 功能特性

- 🚀 快速启动开发服务器
- 📦 自动配置 Vite + React + SWC
- 🔄 支持实时热更新
- 🛠️ 自动处理 antd 组件的别名配置
- 💡 内置 React 19 兼容补丁

## 项目结构

开发服务器启动后，会在项目的 `node_modules/.antd` 目录下创建以下文件：

```
node_modules/.antd/
├── index.html          # 开发服务器入口 HTML
├── main.tsx           # React 入口文件
├── patch.ts           # React 19 兼容补丁
├── playground.tsx     # 组件开发测试页面
└── tsconfig.json      # TypeScript 配置
```

## 注意事项

1. 确保在 antd 项目根目录下运行命令
2. 首次运行会自动创建开发环境所需的文件
3. 如需重新生成开发环境文件，可使用 `--force` 选项

## 许可证

MIT © baicie
