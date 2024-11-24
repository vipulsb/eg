import {
  LoggedInUser,
  LoginRequestDto,
  UserResponseDto,
  UserSignUpDto,
} from "../types/user";
import { apiClient } from "../api/client";
import { AxiosResponse } from "axios";

export const loginApi = async (payload: LoginRequestDto) => {
  const response = await apiClient.post("/user/login", payload, {
    withCredentials: true,
  });
  return response.data;
};

export const logoutApi = async () => {
  await apiClient.post("/user/logout", {}, { withCredentials: true });
};

export const userSignUpApi = async (
  payload: UserSignUpDto,
): Promise<{ user: LoggedInUser | null }> => {
  const response: AxiosResponse<{ user: LoggedInUser }> = await apiClient.post(
    "/user/sign-up",
    payload,
    { withCredentials: true },
  );
  return response.data;
};

export const checkAuthStatusApi = async (): Promise<UserResponseDto | null> => {
  const response: AxiosResponse<UserResponseDto | null> = await apiClient.get(
    "/user/check-status",
    {
      withCredentials: true,
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    },
  );
  return response.data;
};
