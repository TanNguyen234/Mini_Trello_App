import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { accessToken } = useSelector((state) => state.auth);

  if (!accessToken) return <Navigate to="/login" />;
  return children;
};

export default PrivateRoute;