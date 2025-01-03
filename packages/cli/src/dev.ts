import { createServer } from "vite";
import type { InlineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs-extra";
import path from "path";

export const bareImportRE = /(?<=^)(?![a-zA-Z]:)[\w@](?!.*:\/\/).*$/;

interface StartDevServerOptions {
  root: string;
}

async function checkAndCreateDevFiles(root: string) {
  try {
    // 读取 package.json
    const pkgPath = path.resolve(root, "package.json");
    const pkg = await fs.readJSON(pkgPath);

    // 检查是否是 antd 项目
    if (pkg.name === "antd") {
      const cachePath = path.resolve(root, "node_modules/.antd");
      const indexHtmlPath = path.resolve(cachePath, "index.html");
      const mainTsPath = path.resolve(cachePath, "main.tsx");

      // 创建缓存目录
      await fs.ensureDir(cachePath);

      // 创建 index.html
      const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ant Design Dev</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/main.tsx"></script>
  </body>
</html>`;

      // 创建 main.ts
      const mainTs = `
import React from 'react';
import { createRoot } from 'react-dom/client';

// 这里可以导入你要开发的组件
import Button from '../../components/button/index';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Button />
  </React.StrictMode>
);`;

      if (!(await fs.pathExists(indexHtmlPath))) {
        await fs.writeFile(indexHtmlPath, indexHtml);
      }

      if (!(await fs.pathExists(mainTsPath))) {
        await fs.writeFile(mainTsPath, mainTs);
      }

      return cachePath;
    }

    return root;
  } catch (error) {
    console.error("Error creating dev files:", error);
    return root;
  }
}

export async function startServer(options: StartDevServerOptions) {
  const devRoot = await checkAndCreateDevFiles(options.root);
  const config: InlineConfig = {
    root: devRoot,
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      fs: {
        allow: [options.root],
        strict: false,
      },
      watch: {
        ignored: ["!**/node_modules/.antd/**"],
      },
    },
    resolve: {
      alias: [
        {
          find: "antd",
          replacement: path.resolve(options.root, "components/index.ts"),
        },
        {
          find: "antd/es",
          replacement: path.resolve(options.root, "components"),
        },
        {
          find: "antd/lib",
          replacement: path.resolve(options.root, "components"),
        },
        {
          find: "antd/locale",
          replacement: path.resolve(options.root, "components/locale"),
        },
      ],
    },
  };

  const server = await createServer(config);
  await server.listen();
  console.log("开发服务器已启动");

  server.printUrls();
  return server;
}
