import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { UserResponseDto } from "../dto/UserResponse";
import { UserService } from "./user.service";
import { logger } from "../../../logger";

@Injectable()
export class LocalStrategyService extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<UserResponseDto> {
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
    return user;
  }
}
