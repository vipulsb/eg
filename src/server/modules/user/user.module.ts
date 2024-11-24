import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./services/user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../entity/user";
import { LocalStrategyService } from "./services/local-strategy.service";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
  ],
  controllers: [UserController],
  providers: [UserService, LocalStrategyService],
})
export class UserModule {}
