import axios from "axios";
import React, { Dispatch } from "react";
import { User } from "../types/userType";

export const getUserInfo = async (
  walletAddress: string,
  setUserInfo: Dispatch<React.SetStateAction<null | User>>,
  setLoading: Dispatch<React.SetStateAction<boolean>>
) => {
  if (walletAddress) {
    setLoading(true);
    await axios
      .post(`${process.env.NEXT_PUBLIC_APP_URL}/api/addUser` as string, {
        walletAddress: walletAddress,
      })
      .then((res) => {
        setUserInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        alert("Something went wrong, Try again");
        setLoading(false);
      });
  }
};
