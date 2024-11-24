import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./modules/user/user.module";
import * as process from "node:process";
import { logger } from "./logger";
import path from "node:path";
import { ServeStaticModule } from "@nestjs/serve-static";

const staticFilesPath = path.resolve(__dirname, "../client");

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: staticFilesPath,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const DB_USERNAME = configService.get("DB_USERNAME");
        const DB_PASSWORD = configService.get("DB_PASSWORD");
        const DB_PORT = configService.get("DB_PORT");
        const DB_HOST = configService.get("DB_HOST");
        const DB_NAME = configService.get("DB_NAME");
        const mongoUri = `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
        return { uri: mongoUri };
      },
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  async onModuleInit() {
    logger.info(`Application started on port: ${process.env.APP_PORT}`);
  }
}
