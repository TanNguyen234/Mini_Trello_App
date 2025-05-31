import DefaultLayout from "../components/layouts/DefaultLayout";
import LoginPage from "../pages/auth/login";
import VerifyPage from "../pages/auth/verify";
import Home from "../pages/home";

export const routes = [
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage />
    },{
        path: "/verify",
        element: <VerifyPage />
    }
    // {
    //     path: "/register",
    //     element: <RegisterPage />
    // }
]