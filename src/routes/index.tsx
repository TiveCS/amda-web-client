import AuthGuard from "@guards/AuthGuard";
import GuestOnlyGuard from "@guards/GuestOnlyGuard";
import DaftarMitra from "@pages/DaftarMitra";
import DaftarRole from "@pages/DaftarRole";
import DaftarUser from "@pages/DaftarUser";
import Dashboard from "@pages/Dashboard";
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
        element: <AuthGuard />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
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
            index: true,
            element: <Navigate to="/auth/login" />,
          },
          {
            path: "login",
            element: (
              <GuestOnlyGuard fallback="/">
                <LoginPage />
              </GuestOnlyGuard>
            ),
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
