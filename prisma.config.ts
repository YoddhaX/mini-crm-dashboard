import { defineConfig } from "prisma7/config";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma/dev.db");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: `file://${dbPath}`,
  },
});
