/* eslint-disable react-refresh/only-export-components */

import AuthGuard from "@guards/AuthGuard";
import GuestOnlyGuard from "@guards/GuestOnlyGuard";
import DashboardLayout from "@layouts/DashboardLayout";
import { LoadingOverlay } from "@mantine/core";
import ErrorPage from "@pages/errors/ErrorPage";
import LogoutRedirect from "@pages/redirect/Logout";
import { Suspense, lazy } from "react";
import { Navigate, Outlet, createBrowserRouter } from "react-router-dom";

// lazy load all the components
const Dashboard = lazy(() => import("@pages/Dashboard"));
const AgendaTim = lazy(() => import("@pages/AgendaTim"));
const DaftarBOQ = lazy(() => import("@pages/DaftarBOQ"));
const DaftarDesignator = lazy(() => import("@pages/DaftarDesignator"));
const DaftarKegiatan = lazy(() => import("@pages/DaftarKegiatan"));
const DaftarMitra = lazy(() => import("@pages/DaftarMitra"));
const DaftarOCC = lazy(() => import("@pages/DaftarOCC"));
const DaftarODC = lazy(() => import("@pages/DaftarODC"));
const DaftarODP = lazy(() => import("@pages/DaftarODP"));
const DaftarRole = lazy(() => import("@pages/DaftarRole"));
const DaftarUser = lazy(() => import("@pages/DaftarUser"));
const LoginPage = lazy(() => import("@pages/Login"));
const StatusBOQ = lazy(() => import("@pages/StatusBOQ"));

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<LoadingOverlay visible />}>
        <Outlet />
      </Suspense>
    ),
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
            path: "agenda",
            element: <AgendaTim />,
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
