import DefaultLayout from "../components/layouts/DefaultLayout";
import LoginPage from "../pages/auth/login";
import VerifyPage from "../pages/auth/verify";
import BoardManagementPage from "../pages/board/Board";
import Home from "../pages/home";

export const routes = [
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/boards",
                element: <BoardManagementPage />
            },{
                path: "/cards",
                element: <></>
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