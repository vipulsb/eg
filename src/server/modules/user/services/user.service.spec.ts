import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getModelToken } from "@nestjs/mongoose";
import { ConflictException } from "@nestjs/common";

describe("UserService", () => {
  let userService: UserService;
  let mockUserModel: any;
  let instanceMock: any;

  beforeEach(async () => {
    instanceMock = {
      save: jest.fn(),
    };

    mockUserModel = jest.fn(() => instanceMock);
    mockUserModel.findOne = jest.fn();
    mockUserModel.find = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken("User"),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(userService).toBeDefined();
  });

  describe("registerUser", () => {
    it("should register a new user when no user exists with the given email", async () => {
      const userPayload = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const savedUser = {
        id: "123",
        ...userPayload,
      };

      mockUserModel.findOne.mockResolvedValue(null);
      instanceMock.save.mockResolvedValue(savedUser);

      const result = await userService.registerUser(userPayload);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: userPayload.email,
      });
      expect(mockUserModel).toHaveBeenCalledWith(userPayload);
      expect(instanceMock.save).toHaveBeenCalled();
      expect(result).toEqual(savedUser);
    });

    it("should throw a ConflictException if the user already exists", async () => {
      const userPayload = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      const existingUser = { id: "123", email: "test@example.com" };

      mockUserModel.findOne.mockResolvedValue(existingUser);

      await expect(userService.registerUser(userPayload)).rejects.toThrow(
        new ConflictException("User already registered"),
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: userPayload.email,
      });
      expect(mockUserModel).not.toHaveBeenCalled();
    });
  });
});
