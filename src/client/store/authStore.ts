import { create } from "zustand";
import { AuthState } from "../types/auth";
import {
  checkAuthStatusAction,
  defaultAuthState,
  loginAction,
  logoutAction,
  userRegisterAction,
} from "./authActions";

export const useAuthStore = create<AuthState>((set) => {
  return {
    ...defaultAuthState,
    login: loginAction(set),
    logout: logoutAction(set),
    checkAuthStatus: checkAuthStatusAction(set),
    registerUser: userRegisterAction(set),
  };
});
