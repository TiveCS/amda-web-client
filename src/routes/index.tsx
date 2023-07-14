import Home from "@pages/Home";
import NotFoundPage from "@pages/errors/404";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);
