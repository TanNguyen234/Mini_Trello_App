import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const authState = useSelector((state) => state.auth);

  console.log("PrivateRoute - full authState from useSelector:", authState); // LOG 8
  const { accessToken } = authState;

  if (!accessToken) {
    console.log("PrivateRoute: No accessToken, redirecting to /login. Current token value:", accessToken); // LOG 9
    return <Navigate to="/login" />;
  }
  console.log("PrivateRoute: accessToken FOUND, allowing access. Current token value:", accessToken); // LOG 10
  return children;
};

export default PrivateRoute;