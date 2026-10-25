import { User } from "./auth";
import { UserProfileData } from "./club";

export type UserProfile = {
    user: User;
    memberProfile: UserProfileData;
}