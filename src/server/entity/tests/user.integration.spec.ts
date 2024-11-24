import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Connection, Model } from "mongoose";
import { UserDocument, UserSchema } from "../user";

describe("UserSchema Integration Tests", () => {
  let mongoServer: MongoMemoryServer;
  let connection: Connection;
  let UserModel: Model<UserDocument>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    connection = await mongoose.createConnection(uri).asPromise();

    UserModel = connection.model<UserDocument>("User", UserSchema);
  });

  afterAll(async () => {
    await connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await UserModel.deleteMany({});
  });

  describe("User creation", () => {
    it("should hash the password before saving the user", async () => {
      const user = new UserModel({
        email: "test@example.com",
        password: "password123",
      });

      await user.save();

      expect(user.password).not.toBe("password123");
    });

    it("should not rehash the password if it is not modified", async () => {
      const user = new UserModel({
        email: "test@example.com",
        password: "password123",
      });

      await user.save();

      const originalHashedPassword = user.password;

      user.email = "updated@example.com";
      await user.save();

      expect(user.password).toBe(originalHashedPassword);
    });
  });

  describe("Password validation", () => {
    it("should return true for valid password", async () => {
      const user = new UserModel({
        email: "test@example.com",
        password: "password123",
      });

      await user.save();

      const isValid = await user.validatePassword("password123");
      expect(isValid).toBe(true);
    });

    it("should return false for invalid password", async () => {
      const user = new UserModel({
        email: "test@example.com",
        password: "password123",
      });

      await user.save();

      const isValid = await user.validatePassword("wrongpassword");
      expect(isValid).toBe(false);
    });
  });

  describe("Unique email constraint", () => {
    it("should enforce unique email addresses", async () => {
      const user1 = new UserModel({
        email: "test@example.com",
        password: "password123",
      });

      const user2 = new UserModel({
        email: "test@example.com",
        password: "password456",
      });

      await user1.save();

      await expect(user2.save()).rejects.toThrowError(/duplicate key error/);
    });
  });
});
