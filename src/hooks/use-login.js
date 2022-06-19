import { useQuery } from "react-query";

import { login } from "../api/api";

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
