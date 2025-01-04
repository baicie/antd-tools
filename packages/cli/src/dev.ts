import { createServer } from "vite";
import type { InlineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import fs from "fs-extra";
import { fileURLToPath } from "node:url";
import path from "path";

export const bareImportRE = /(?<=^)(?![a-zA-Z]:)[\w@](?!.*:\/\/).*$/;
const rootPath = path.resolve(fileURLToPath(import.meta.url), "../../");
const templatesPath = path.resolve(rootPath, "templates");

interface StartDevServerOptions {
  root: string;
  force?: boolean;
}

async function checkAndCreateDevFiles(root: string, force = false) {
  try {
    // 读取 package.json
    const pkgPath = path.resolve(root, "package.json");
    const versionPath = path.resolve(
      root,
      "components",
      "version",
      "version.ts"
    );
    const pkg = await fs.readJSON(pkgPath);

    // 检查是否是 antd 项目
    if (pkg.name === "antd") {
      const cachePath = path.resolve(root, "node_modules/.antd");

      // 创建缓存目录
      await fs.ensureDir(cachePath);
      const files = await fs.readdir(cachePath);
      const isEmpty = files.length === 0;
      if (isEmpty || force) {
        await fs.copy(templatesPath, cachePath);
        await fs.writeFile(versionPath, `export default '0.0.0'`);
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
  const devRoot = await checkAndCreateDevFiles(options.root, options.force);
  const config: InlineConfig = {
    root: devRoot,
    plugins: [react()],
    server: {
      port: 3000,
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
  server.printUrls();
  return server;
}
