import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",
    headless: true,
    launchOptions: {
      slowMo: 1000
    }
  },
  timeout: 60_000
});
