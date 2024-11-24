import { ConflictException, Injectable } from "@nestjs/common";
import { UserSignUpDto } from "../dto/UserRequest";
import { UserDocument, User } from "../../../entity/user";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserResponseDto } from "../dto/UserResponse";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async registerUser(userPayload: UserSignUpDto): Promise<UserDocument> {
    const existingUser = await this.getUserByEmail(userPayload.email);
    if (existingUser) {
      throw new ConflictException("User already registered");
    }

    const newUser = new this.userModel({
      email: userPayload.email,
      password: userPayload.password,
      name: userPayload.name,
    });
    return newUser.save();
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email });
  }

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.find();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserResponseDto> {
    const user = await this.userModel
      .findOne({ email })
      .select("+password")
      .exec();
    if (user && (await user.validatePassword(password))) {
      return this.makeUserResponseDto(user);
    }
    return null;
  }

  makeUserResponseDto(user: UserDocument): UserResponseDto {
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    return userResponse;
  }
}
