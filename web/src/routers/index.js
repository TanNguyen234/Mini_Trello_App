import DefaultLayout from "../components/layouts/DefaultLayout";
import PrivateRoute from "../components/Private";
import LoginPage from "../pages/auth/login";
import VerifyPage from "../pages/auth/verify";
import BoardManagementPage from "../pages/board/Board";
import CardBoardDnD from "../pages/card";
import Error_404 from "../pages/errors/404";

export const routes = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DefaultLayout />
      </PrivateRoute>
    ),
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
  {
    path: "*",
    element: <Error_404 />,
  },
];
