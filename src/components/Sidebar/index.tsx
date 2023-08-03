import { Link } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { useProfileStore } from "@zustand/profileStore";
import Accordion from "./Accordion";
import Logo from "/assets/img/amda-putih.png";
import { Image } from "@mantine/core";

export default function Sidebar() {
  const { profile } = useProfileStore();

  if (!profile) {
    return <p>Loading...</p>;
  }
  return (
    <nav
      style={{
        backgroundColor: "#000000",
        backgroundImage: "linear-gradient(147deg, #000000 0%, #9e0c0c 74%)",
        height: "100%",
        color: "#505050",
        display: "grid",
      }}
    >
      <div className="flex justify-center items-center py-8 flex-col gap-y-4 row-span-1">
        <Link to={"/"}>
          <Image
            maw={150}
            mx="auto"
            src={Logo}
            alt="logo amda"
            className="mb-8"
          />
        </Link>

        <div className="font-normal text-center leading-loose text-sm text-white">
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
                title: "Designator",
                to: "/designator",
              },
              {
                title: "Kegiatan Mitra",
                to: "/boq/kegiatan-mitra",
              },
              {
                title: "Daftar BOQ",
                to: "/boq",
              },
              {
                title: "Status BOQ",
                to: "/boq/status",
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
