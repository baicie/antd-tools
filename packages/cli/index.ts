import cac from "cac";
import { startServer } from "./src/dev";

const cli = cac("mao");

cli
  .command("[root]", "启动开发服务器")
  .alias("dev")
  .action(
    async (
      root: string = process.cwd(),
      options: { platform?: string } = {}
    ) => {
      try {
        process.env.NODE_ENV = "development";
        await startServer({
          root,
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
