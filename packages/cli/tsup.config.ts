import { defineConfig } from "tsup";
import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: [...Object.keys(pkg.dependencies)],
  outDir: "dist",
});
