import { api, post, ApiError } from "./api";
import { useAuth } from "@/store/auth";
import { getUrl } from "../utils";
import type { User } from "@/types"; // adjust to your real user type name
import {
  forgotPasswordPayload,
  loginPayload,
  registerPayload,
  resetPasswordPayload,
} from "@/types";

type AuthResponse = { user: User };

// TODO (later step): move these two side effects into hooks (useLogin, useRegister)
function saveSession(data: AuthResponse) {
  localStorage.setItem("is_authenticated", "true");
  useAuth.getState().setAuth(data.user);
}

export const AuthApi = {
  register: async (payload: registerPayload) => {
    const data = await post<AuthResponse>("/auth/register", payload);
    if (data?.user) saveSession(data);
    return data;
  },

  login: async (payload: loginPayload) => {
    const data = await post<AuthResponse>("/auth/login", payload);
    if (data?.user) saveSession(data);
    return data;
  },

  logout: async () => {
    try {
      await post("/auth/logout");
    } finally {
      localStorage.removeItem("is_authenticated");
    }
  },

  forgotPassword: (payload: forgotPasswordPayload) => post("/auth/forget-password", payload),

  resetPassword: (payload: resetPasswordPayload) =>
    post("/auth/reset-password", {
      token: payload.token,
      password: payload.newPassword,
    }),

  // Full page redirect (not an API call), so it stays as it was
  oauthLogin: () => {
    const returnTo = window.location.pathname + window.location.search;
    window.location.href =
      getUrl("/auth/google/login") + "?returnTo=" + encodeURIComponent(returnTo);
  },

  // null when not logged in (401)
  getMe: async () => {
    try {
      const data = await api<AuthResponse>("/auth/me");
      return data.user;
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        localStorage.removeItem("is_authenticated");
        return null;
      }
      throw err;
    }
  },

  checkLoginAvailable: (login: string) =>
    api<{ available: boolean }>(`/auth/login-available?login=${encodeURIComponent(login)}`),
};
