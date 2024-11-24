import { UserLoginDto } from "../../server/modules/user/dto/UserRequest";
import { LoggedInUser, UserSignUpDto } from "./user";

export type AuthState = {
  isAuthenticated: boolean;
  user: LoggedInUser;
  isLoading: boolean;

  login: (payload: UserLoginDto) => Promise<void>;
  logout: () => Promise<void>;
  registerUser: (payload: UserSignUpDto) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
};
