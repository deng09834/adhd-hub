import "dotenv/config"; // ⬅️ 加上这一行极其关键！它会把 .env 文件加载进来
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});