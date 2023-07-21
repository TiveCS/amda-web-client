import AuthGuard from "@guards/AuthGuard";
import GuestOnlyGuard from "@guards/GuestOnlyGuard";
import DaftarMitra from "@pages/DaftarMitra";
import DaftarRole from "@pages/DaftarRole";
import DaftarUser from "@pages/DaftarUser";
import Home from "@pages/Home";
import LoginPage from "@pages/Login";
import ErrorPage from "@pages/errors/ErrorPage";
import LogoutRedirect from "@pages/redirect/Logout";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        element: <AuthGuard />,
        errorElement: <Navigate to="/auth/login" />,
        children: [
          {
            path: "management",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Navigate to="/management/users" />,
              },
              {
                path: "users",
                element: <DaftarUser />,
              },
              {
                path: "roles",
                element: <DaftarRole />,
              },
              {
                path: "mitras",
                element: <DaftarMitra />,
              },
            ],
          },
        ],
      },
      {
        path: "auth",
        element: <Outlet />,
        children: [
          {
            element: <GuestOnlyGuard />,
            children: [
              {
                index: true,
                element: <Navigate to="/auth/login" />,
              },
              {
                path: "login",
                element: <LoginPage />,
              },
            ],
          },
          {
            element: <AuthGuard />,
            children: [
              {
                path: "logout",
                element: <LogoutRedirect />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
