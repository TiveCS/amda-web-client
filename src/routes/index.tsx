import AuthGuard from "@guards/AuthGuard";
import GuestOnlyGuard from "@guards/GuestOnlyGuard";
import DashboardLayout from "@layouts/DashboardLayout";
import DaftarBOQ from "@pages/DaftarBOQ";
import DaftarDesignator from "@pages/DaftarDesignator";
import DaftarKegiatan from "@pages/DaftarKegiatan";
import DaftarMitra from "@pages/DaftarMitra";
import DaftarOCC from "@pages/DaftarOCC";
import DaftarODC from "@pages/DaftarODC";
import DaftarODP from "@pages/DaftarODP";
import DaftarRole from "@pages/DaftarRole";
import DaftarUser from "@pages/DaftarUser";
import Dashboard from "@pages/Dashboard";
import LoginPage from "@pages/Login";
import StatusBOQ from "@pages/StatusBOQ";
import ErrorPage from "@pages/errors/ErrorPage";
import LogoutRedirect from "@pages/redirect/Logout";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        ),
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
          {
            path: "designator",
            element: <DaftarDesignator />,
          },
          {
            path: "boq",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <DaftarBOQ />,
              },
              {
                path: "status",
                element: <StatusBOQ />,
              },
              {
                path: "kegiatan-mitra",
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <DaftarKegiatan />,
                  },
                ],
              },
            ],
          },
          {
            path: "kordinat",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Navigate to="/kordinat/odc" />,
              },
              {
                path: "odc",
                element: <DaftarODC />,
              },
              {
                path: "odp",
                element: <DaftarODP />,
              },
              {
                path: "occ",
                element: <DaftarOCC />,
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
