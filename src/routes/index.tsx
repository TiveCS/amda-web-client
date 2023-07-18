import Home from "@pages/Home";
import DaftarUser from "@pages/DaftarUser";
import DaftarMitra from "@pages/DaftarMitra";
import NotFoundPage from "@pages/errors/404";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import DaftarBOQ from "@pages/DaftarBOQ";
import DaftarKegiatan from "@pages/DaftarKegiatan";
import StatusBOQ from "@pages/StatusBOQ";
import DaftarRole from "@pages/DaftarRole";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/daftar-user" element={<DaftarUser />} />
      <Route path="/daftar-role" element={<DaftarRole />} />
      <Route path="/daftar-mitra" element={<DaftarMitra />} />
      <Route path="/daftar-kegiatan" element={<DaftarKegiatan />} />
      <Route path="/daftar-boq" element={<DaftarBOQ />} />
      <Route path="/status-boq" element={<StatusBOQ />} />
    </>
  )
);
