import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { UserSignUpDto } from "./dto/UserRequest";
import { UserService } from "./services/user.service";
import { UserResponseDto } from "./dto/UserResponse";
import { UserDocument } from "../../entity/user";
import { AuthGuard } from "@nestjs/passport";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard("local"))
  @Get("/")
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users: UserDocument[] = await this.userService.getAllUsers();
    return users.map((user) => this.userService.makeUserResponseDto(user));
  }

  @Post("/sign-up")
  async registerUser(@Body() userPayload: UserSignUpDto) {
    const user: UserDocument = await this.userService.registerUser(userPayload);
    return { user: this.userService.makeUserResponseDto(user) };
  }

  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req) {
    req.session.user = req.user;
    return { message: "Login successful", user: req.user };
  }

  @Post("logout")
  async logout(@Req() req): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException("Failed to destroy session"),
          );
        }
        resolve({ message: "Logout successful" });
      });
    });
  }

  @Get("check-status")
  async checkLoginStatus(@Req() req, @Res() res) {
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    if (!req.session?.user) {
      throw new UnauthorizedException();
    }
    return {
      user: req.session.user,
    };
  }
}
