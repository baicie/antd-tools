import cac from "cac";
import { startServer } from "./src/dev";

const cli = cac("bantd");

cli
  .command("[root]", "启动开发服务器")
  .alias("dev")
  .option("-f, --force", "强制覆盖已存在的文件")
  .action(
    async (
      root: string = process.cwd(),
      options: { force?: boolean; platform?: string } = {}
    ) => {
      try {
        process.env.NODE_ENV = "development";
        await startServer({
          root,
          force: options.force,
        });
      } catch (error) {
        console.error("启动失败:", error);
        process.exit(1);
      }
    }
  );

cli.help();
cli.version("1.0.0");

cli.parse();
