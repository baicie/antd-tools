import React from "react";
import { createRoot } from "react-dom/client";
import "./patch.ts";

// 这里可以导入你要开发的组件
import { Playground } from "./playground";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Playground />
  </React.StrictMode>
);
