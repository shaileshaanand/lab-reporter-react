import { Redirect } from "raviger";
import useToken from "../../hooks/use-token";

const ProtectedRoute = ({ element }) => {
  const [token] = useToken();
  return token ? element : <Redirect to="/login" replace={false} />;
};
export default ProtectedRoute;
