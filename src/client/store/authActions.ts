import { StoreApi } from "zustand/vanilla";
import { AuthState } from "../types/auth";
import {
  checkAuthStatusApi,
  loginApi,
  logoutApi,
  userSignUpApi,
} from "./authApi";
import { LoginRequestDto, UserResponseDto, UserSignUpDto } from "../types/user";

export const loginAction = (set: StoreApi<AuthState>["setState"]) => {
  return async (payload: LoginRequestDto) => {
    set({ isLoading: true });
    try {
      const { user } = await loginApi(payload);
      if (user?.id) {
        set({
          isAuthenticated: true,
          isLoading: false,
          user,
        });
      }
    } catch (err) {
      set(defaultAuthState);
      throw err;
    }
  };
};

export const logoutAction = (set: StoreApi<AuthState>["setState"]) => {
  return async () => {
    set({ isLoading: true });
    try {
      await logoutApi();
      set(defaultAuthState);
    } catch (err) {
      set(defaultAuthState);
      throw err;
    }
  };
};

export const checkAuthStatusAction = (set: StoreApi<AuthState>["setState"]) => {
  return async () => {
    set({ isLoading: true });
    try {
      const user: UserResponseDto = await checkAuthStatusApi();
      if (user) {
        return set({ isAuthenticated: true, user, isLoading: false });
      }
    } catch (err) {
      set(defaultAuthState);
      throw err;
    }
  };
};

export const userRegisterAction = (set: StoreApi<AuthState>["setState"]) => {
  return async (payload: UserSignUpDto) => {
    set({ isLoading: true });
    try {
      const { user } = await userSignUpApi(payload);
      if (user?.id) {
        return set({
          isLoading: false,
          user: user,
          isAuthenticated: true,
        });
      }
    } catch (err) {
      set(defaultAuthState);
      throw err;
    }
  };
};

export const defaultAuthState = {
  isAuthenticated: false,
  user: {
    id: "",
    name: "",
    email: "",
  },
  isLoading: false,
};
