import { useQuery } from "react-query";
import { login } from "../api/api";
import { API_URL } from "../config/constants";

const useLogin = (data, options) => {
  return useQuery(
    "login",
    async () => {
      const response = await login(data);
      return response[1];
    },
    {
      enabled: false,
      // retry: false,
      ...options,
    }
  );
};

export default useLogin;
