import { useLocalStorage } from "@mantine/hooks";

const useToken = () => {
  return useLocalStorage({ key: "token" });
};
export default useToken;
