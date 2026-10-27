import { JoinedClub, UserProfile } from "@/types";
import { api } from "./api";

export const UsersApi = {
  // Fetch the currently logged-in user's complete profile
  getMyProfile: () => api<UserProfile>("/users/me/profile"),

  // Fetch a public user's profile by their ID
  getUserProfile: (userId: number) => api<UserProfile>(`/users/${userId}/profile`),

    // /users/:userId/memberships
  // @Get(':user_id/memberships')
  // async getUserMemberships(
  //   @Param() { user_id }: GetUserParamDto,
  // ): Promise<JoinedClub[]> {
  //   return rpc<JoinedClub[]>(
  //     this.clubClient,
  //     CLUB_PATTERNS.GET_USER_MEMBERSHIPS,
  //     {
  //       user_id: user_id,
  //     },
  //   );
  // }

  getJoinedClubs: (userId: number) => api<JoinedClub[]>(`/users/${userId}/memberships`),

};
