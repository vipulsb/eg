import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./services/user.service";

import {
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";

describe("UserController", () => {
  let userController: UserController;
  let userService: UserService;

  const mockUsers = [
    { id: "1", email: "test1@example.com", name: "User1" },
    { id: "2", email: "test2@example.com", name: "User2" },
  ];

  const mockUserService = {
    getAllUsers: jest.fn(),
    registerUser: jest.fn(),
    makeUserResponseDto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(userController).toBeDefined();
  });

  describe("getAllUsers", () => {
    it("should return a list of user response DTOs", async () => {
      mockUserService.getAllUsers.mockResolvedValue(mockUsers);
      mockUserService.makeUserResponseDto.mockImplementation((user) => user);

      const result = await userController.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
      expect(userService.makeUserResponseDto).toHaveBeenCalledTimes(
        mockUsers.length,
      );
    });
  });

  describe("registerUser", () => {
    it("should register a new user and return the user response DTO", async () => {
      const mockPayload = {
        email: "test@example.com",
        password: "password",
        name: "Test User",
      };
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };

      mockUserService.registerUser.mockResolvedValue(mockUser);
      mockUserService.makeUserResponseDto.mockReturnValue(mockUser);

      const result = await userController.registerUser(mockPayload);

      expect(result).toEqual({ user: mockUser });
      expect(userService.registerUser).toHaveBeenCalledWith(mockPayload);
      expect(userService.makeUserResponseDto).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("login", () => {
    it("should set the session user and return a success message", async () => {
      const mockReq = {
        session: { user: undefined },
        user: { id: "1", email: "test@example.com" },
      };

      const result = await userController.login(mockReq);

      expect(mockReq.session.user).toEqual(mockReq.user);
      expect(result).toEqual({
        message: "Login successful",
        user: mockReq.user,
      });
    });
  });

  describe("logout", () => {
    it("should destroy the session and return a success message", async () => {
      const mockReq = {
        session: {
          destroy: jest.fn((cb) => cb(null)), // Simulate successful destruction
        },
      };

      const result = await userController.logout(mockReq);

      expect(mockReq.session.destroy).toHaveBeenCalled();
      expect(result).toEqual({ message: "Logout successful" });
    });

    it("should throw an InternalServerErrorException if session destruction fails", async () => {
      const mockReq = {
        session: {
          destroy: jest.fn((cb) => cb(new Error("Destroy failed"))), // Simulate failure
        },
      };

      await expect(userController.logout(mockReq)).rejects.toThrow(
        new InternalServerErrorException("Failed to destroy session"),
      );

      expect(mockReq.session.destroy).toHaveBeenCalled();
    });
  });

  describe("checkLoginStatus", () => {
    it("should return the user if session is valid", async () => {
      const mockReq = {
        session: { user: { id: "1", email: "test@example.com" } },
      };
      const mockRes = {
        setHeader: jest.fn(),
      };

      const result = await userController.checkLoginStatus(mockReq, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      expect(result).toEqual({ user: mockReq.session.user });
    });

    it("should throw UnauthorizedException if session is invalid", async () => {
      const mockReq = { session: {} };
      const mockRes = { setHeader: jest.fn() };

      await expect(
        userController.checkLoginStatus(mockReq, mockRes),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
    });
  });
});
