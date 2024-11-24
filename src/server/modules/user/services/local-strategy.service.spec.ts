import { Test, TestingModule } from "@nestjs/testing";
import { UnauthorizedException } from "@nestjs/common";
import { LocalStrategyService } from "./local-strategy.service";
import { UserService } from "./user.service";
import { UserResponseDto } from "../dto/UserResponse";

describe("LocalStrategyService", () => {
  let localStrategy: LocalStrategyService;
  let userService: UserService;

  const mockUserService = {
    validateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategyService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    localStrategy = module.get<LocalStrategyService>(LocalStrategyService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(localStrategy).toBeDefined();
  });

  describe("validate", () => {
    it("should return the user if validation succeeds", async () => {
      const email = "test@example.com";
      const password = "password123";
      const mockUser: UserResponseDto = {
        id: "123",
        email,
        name: "Test User",
      };

      mockUserService.validateUser.mockResolvedValue(mockUser);

      const result = await localStrategy.validate(email, password);

      expect(userService.validateUser).toHaveBeenCalledWith(email, password);
      expect(result).toEqual(mockUser);
    });

    it("should throw UnauthorizedException if validation fails", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";

      mockUserService.validateUser.mockResolvedValue(null);

      await expect(localStrategy.validate(email, password)).rejects.toThrow(
        new UnauthorizedException("Invalid credentials"),
      );

      expect(userService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
});
