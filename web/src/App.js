import AllRoutes from "./components/Allroutes";
import './App.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { autoLogin, setIsAuthChecked } from "./redux/authSlice";
import { Spin } from "antd";
import { getCookie } from "./helpers/cookie";

function App() {
  const dispatch = useDispatch();
  // Destructure isAuthChecked from the auth state
  const { accessToken, loading, error, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only dispatch autoLogin if the authentication check hasn't completed yet
    if (!isAuthChecked) {
      if (getCookie("accessToken")) { // Only attempt autoLogin if a cookie exists
        dispatch(autoLogin());
      } else {
        // If no accessToken in cookie, we still need to mark auth check as complete.
        // This prevents the infinite spin.
        dispatch(setIsAuthChecked(true)); // Dispatch a new action to set isAuthChecked
      }
    }
  }, [dispatch, isAuthChecked]); // Add isAuthChecked to dependency array

  console.log("App.js - loading:", loading, "accessToken:", accessToken, "error:", error, "isAuthChecked:", isAuthChecked); // LOG 7 updated

  // Render Spin fullscreen if still loading or if the initial authentication check hasn't completed
  if (loading || !isAuthChecked) {
    return <Spin fullscreen />;
  }

  // Once loading is false and isAuthChecked is true, render the routes
  return <AllRoutes />
}

export default App;