import { Redirect } from "raviger";

import useToken from "../../hooks/use-token";

const UnprotectedRoute = ({ element }) => {
  const [token] = useToken();
  return token ? <Redirect to="/" /> : element;
};
export default UnprotectedRoute;
