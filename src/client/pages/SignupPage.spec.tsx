import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Signup from "./SignupPage";

const mockNavigate = jest.fn();
jest.mock("../store/authStore", () => ({
  useAuthStore: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Signup Component", () => {
  const mockRegisterUser = jest.fn();

  beforeEach(() => {
    (useAuthStore as unknown as jest.Mock).mockReturnValue({
      registerUser: mockRegisterUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the signup form", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("modal-title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByText("Password requirements")).toBeInTheDocument();
  });

  it("validates input fields on submit", async () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    const submitButton = screen.getByRole("button", { name: /signup/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(
      await screen.findByText("Password requirements not met"),
    ).toBeInTheDocument();
  });

  it("updates formData on input change", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    const emailInput = screen.getByPlaceholderText("Enter your email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const nameInput = screen.getByPlaceholderText("Enter your name");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password1!" } });
    fireEvent.change(nameInput, { target: { value: "Test User" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("Password1!");
    expect(nameInput).toHaveValue("Test User");
  });

  it("shows password requirements as met or unmet", () => {
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    const passwordInput = screen.getByPlaceholderText("Enter your password");

    fireEvent.change(passwordInput, { target: { value: "Pass" } });
    expect(screen.getByText("Minimum length of 8 characters")).toHaveClass(
      "text-gray-500",
    );
    expect(screen.getByText("Contains at least 1 letter")).toHaveClass(
      "text-green-500",
    );
    expect(screen.getByText("Contains at least 1 number")).toHaveClass(
      "text-gray-500",
    );
    expect(
      screen.getByText("Contains at least 1 special character (@$!%*?&)"),
    ).toHaveClass("text-gray-500");

    fireEvent.change(passwordInput, { target: { value: "Password1!" } });
    expect(screen.getByText("Minimum length of 8 characters")).toHaveClass(
      "text-green-500",
    );
    expect(screen.getByText("Contains at least 1 letter")).toHaveClass(
      "text-green-500",
    );
    expect(screen.getByText("Contains at least 1 number")).toHaveClass(
      "text-green-500",
    );
    expect(
      screen.getByText("Contains at least 1 special character (@$!%*?&)"),
    ).toHaveClass("text-green-500");
  });

  it("calls registerUser and navigates to dashboard on successful signup", async () => {
    mockRegisterUser.mockResolvedValueOnce({});
    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "Test User" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "Password1!",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows error if user already exists", async () => {
    mockRegisterUser.mockRejectedValueOnce({ status: 409 });

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "Password1!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your name"), {
      target: { value: "Existing User" },
    });

    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    await waitFor(() => {
      expect(mockRegisterUser).toHaveBeenCalled();
      expect(
        screen.getByText(
          "User with existing@example.com already exists. Please login instead",
        ),
      ).toBeInTheDocument();
    });
  });
});
