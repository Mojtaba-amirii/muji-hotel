import { visionTool } from "@sanity/vision";

import { defineConfig } from "sanity";
import { schemaTypes } from "./schemaTypes";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: "default",
  title: "muji-hotel",

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,

  basePath: "/studio",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
