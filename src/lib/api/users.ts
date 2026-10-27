import { UserProfile } from "@/types";
import { api } from "./api";


export const UsersApi = {
  // Fetch the currently logged-in user's complete profile
  getMyProfile: () => api<UserProfile>("/users/me/profile"),

  // Fetch a public user's profile by their ID
  getUserProfile: (userId: number) => api<UserProfile>(`/users/${userId}/profile`),
};
