import { v4 } from "uuid";
import { User } from "./../../types";

export const GetUserInfo = () => {
  // Try and grab any existing user data from Session
  const user = sessionStorage.getItem(process.env.REACT_APP_USER_INFO || "");

  if (user?.length) {
    // We have a user from session, use that
    return JSON.parse(user);
  } else {
    // Create new user
    const newUser: User = {
      PlayerID: v4(),
      Nickname: "",
    };

    // Since we've made one, put it in session
    sessionStorage.setItem(
      process.env.REACT_APP_USER_INFO || "",
      JSON.stringify(newUser)
    );

    // Return this
    return newUser;
  }
};
