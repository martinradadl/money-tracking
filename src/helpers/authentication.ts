import { UserI } from "../data/authentication";
import { API_URL } from "./env";
import blankProfilePic from "../assets/blank-profile-picture.png";

export const parseProfilePicToUser = (userData: UserI) => {
  return {
    ...userData,
    profilePic: userData.profilePic
      ? `${API_URL}/${userData.profilePic}`
      : blankProfilePic,
  };
};
