import DefaultLayout from "../components/layouts/DefaultLayout";
import LoginPage from "../pages/auth/login";
import VerifyPage from "../pages/auth/verify";
import BoardManagementPage from "../pages/board/Board";
import CardBoardDnD from "../pages/card";
import CardPage from "../pages/card";
import TaskDetailModal from "../components/detail";

export const routes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/boards",
        element: <BoardManagementPage />,
      },
      {
        path: "/cards",
        element: <CardBoardDnD />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/verify",
    element: <VerifyPage />,
  },
  // {
  //     path: "/register",
  //     element: <RegisterPage />
  // }
];
