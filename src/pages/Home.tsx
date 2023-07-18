import Sidebar from "@components/Sidebar";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <p className="bg-red-400">Hello</p>
      <Button>Mantap</Button>
      <br />
      <Link to={"/daftar-user"}>Daftar User</Link>
      <br />
      <Link to={"/daftar-role"}>Daftar Role</Link>
      <br />
      <Link to={"/daftar-mitra"}>Daftar Mitra</Link>
      <br />
      <Link to={"/daftar-kegiatan"}>Daftar Kegiatan</Link>
      <br />
      <Link to={"/daftar-boq"}>Daftar BOQ</Link>
      <br />
      <Link to={"/status-boq"}>Status BOQ</Link>
      <br />
      <Sidebar></Sidebar>
    </>
  );
}

export default Home;
