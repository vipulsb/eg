import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as process from "node:process";
import { configDotenv } from "dotenv";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import session from "express-session";

async function bootstrap() {
  configDotenv();
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT || 3000;
  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: configService.get<string>("AUTH_SECRET") || "",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production" },
    }),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}

bootstrap();
