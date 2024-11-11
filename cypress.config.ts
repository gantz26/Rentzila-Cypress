import { defineConfig } from "cypress"
import { allureCypress } from "allure-cypress/reporter"
import dotenv from "dotenv"

dotenv.config()

export default defineConfig({
  e2e: {
    env: {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
      USER_EMAIL: process.env.USER_EMAIL,
      USER_PASSWORD: process.env.USER_PASSWORD,
      API_BASE_URL: process.env.API_BASE_URL
    },
    setupNodeEvents(on, config) {
      allureCypress(on, config, {
        resultsDir: "allure-results",
      });
      return config;
    },
    baseUrl: process.env.BASE_URL,
    viewportWidth: 1920,
    viewportHeight: 1080,
    scrollBehavior: "nearest",
    defaultCommandTimeout: 10000
  },
})
