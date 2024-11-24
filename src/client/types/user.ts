export type LoginRequestDto = {
  email: string;
  password: string;
};

export type UserSignUpDto = {
  name?: string;
  email: string;
  password: string;
}

export type LoggedInUser = {
  name?: string;
  id: string;
  email: string;
};
export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
};
