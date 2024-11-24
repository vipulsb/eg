import pino from "pino";
import { configDotenv } from "dotenv";
import * as process from "node:process";

configDotenv();

const env = process.env.ENV;
const logger = pino({
  enabled: env !== "test",
  level: process.env.LOG_LEVEL || "info",
}).child({
  environment: env,
});

export { logger };
