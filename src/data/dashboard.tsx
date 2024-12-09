import axios, { AxiosError } from "axios";
import { atom, useRecoilState } from "recoil";
import { createToastify } from "../helpers/toastify";
import { API_URL } from "../helpers/env";
import { userState } from "./authentication";
import { useCookies } from "react-cookie";

export const totalBalanceState = atom<number>({
  key: "totalBalanceState",
  default: 0,
});

export const useDashboard = () => {
  const [totalBalance, setTotalBalance] = useRecoilState(totalBalanceState);
  const [user] = useRecoilState(userState);
  const [cookies] = useCookies(["jwt"]);

  const getTotalBalance = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/balance/${user?._id}`,
        {
          headers: {
            Authorization: "Bearer " + cookies.jwt,
          },
        }
      );
      if (response.status === 200) {
        setTotalBalance(response.data);
      } else {
        createToastify({
          text: "Could not calculate balance",
          type: "error",
        });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        createToastify({
          text: err.response?.data.message || err.message,
          type: "error",
        });
        throw new Error(err.message);
      }
    }
  };

  return { totalBalance, getTotalBalance };
};
