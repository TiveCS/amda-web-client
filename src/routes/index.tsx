import Home from "@pages/Home";
import DaftarUser from "@pages/UserManagement";
import DaftarMitra from "@pages/Mitra";
import NotFoundPage from "@pages/errors/404";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DaftarBOQ from "@pages/DaftarBOQ";
import DaftarKegiatan from "@pages/DaftarKegiatan";
import StatusBOQ from "@pages/StatusBOQ";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/user" element={<DaftarUser />} />
      <Route path="/mitra" element={<DaftarMitra />} />
      <Route path="/daftar-boq" element={<DaftarBOQ />} />
      <Route path="/daftar-kegiatan" element={<DaftarKegiatan />} />
      <Route path="/status-boq" element={<StatusBOQ />} />
    </>
  )
);
