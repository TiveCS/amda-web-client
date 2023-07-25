import { Link } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { useProfileStore } from "@zustand/profileStore";
import Accordion from "./Accordion";

export default function Sidebar() {
  const { profile } = useProfileStore();

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <nav className="bg-red-800 h-full text-gray-50 grid grid-row-span-6">
      <div className="flex justify-center items-center py-8 flex-col gap-y-4 row-span-1">
        <Link to={"/"} className="text-white no-underline font-medium text-2xl">
          AMDA
        </Link>

        <div className="font-normal text-center leading-loose text-sm">
          <p>{profile.name}</p>
          <p>{profile.role.name}</p>
        </div>
      </div>

      <div className="px-8 row-span-3">
        <div className="flex flex-col gap-y-2">
          <SidebarNav to={"/"}>Dashboard</SidebarNav>
          <Accordion
            items={[
              {
                title: "Users",
                to: "/management/users",
              },
              {
                title: "Roles",
                to: "/management/roles",
              },
              {
                title: "Mitra",
                to: "/management/mitras",
              },
            ]}
            text="Management"
          />
          <SidebarNav to={"/agenda"}>Agenda Tim</SidebarNav>
          <Accordion
            items={[
              {
                title: "Kegiatan Mitra",
                to: "/boq/kegiatan-mitra",
              },
              {
                title: "Info Volume",
                to: "/boq/kegiatan-mitra/volume",
              },
              {
                title: "Laporan BOQ",
                to: "/boq",
              },
            ]}
            text="BOQ"
          />
          <Accordion
            items={[
              {
                title: "ODC",
                to: "/kordinat/odc",
              },
              {
                title: "ODP",
                to: "/kordinat/odp",
              },
              {
                title: "OCC",
                to: "/kordinat/occ",
              },
            ]}
            text="Kordinat"
          />
        </div>
      </div>

      <div className="w-full row-span-2 px-8 inline-flex">
        <SidebarNav to={"/auth/logout"}>Logout</SidebarNav>
      </div>
    </nav>
  );
}
