import { Link } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { useProfileStore } from "@zustand/profileStore";
import Accordion from "./Accordion";
import Logo from "/assets/img/amda-putih.png";
import { Image } from "@mantine/core";
import { RoleType } from "../../types";
import { checkRoleAllowed } from "../../utils";

export default function Sidebar() {
  const { profile } = useProfileStore();

  if (!profile) {
    return <p>Loading...</p>;
  }

  const role: RoleType = profile.role.slug as unknown as RoleType;

  const isAllowAgendaTim = checkRoleAllowed(role, {
    blackListedRoles: ["admin-mitra"],
  });

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
            text="Management"
            items={[
              {
                title: "Users",
                to: "/management/users",
                allow: ["admin-ta", "admin-mitra"],
              },
              {
                title: "Roles",
                to: "/management/roles",
                allow: ["admin-ta"],
              },
              {
                title: "Mitra",
                to: "/management/mitras",
                allow: ["admin-ta", "admin-mitra"],
              },
            ]}
          />

          {isAllowAgendaTim && (
            <SidebarNav to={"/agenda"}>Agenda Tim</SidebarNav>
          )}

          <Accordion
            text="BOQ"
            items={[
              {
                title: "Kegiatan Mitra",
                to: "/boq/kegiatan-mitra",
                allow: ["admin-ta", "ta-maintenance", "admin-mitra"],
              },
              {
                title: "Daftar BOQ",
                to: "/boq",
                allow: ["ta-uji-terima", "admin-mitra", "admin-ta"],
              },
              {
                title: "Status BOQ",
                to: "/boq/status",
                allow: ["ta-uji-terima"],
              },
              {
                title: "Designator",
                to: "/designator",
              },
              {
                title: "STO",
                to: "/sto",
              },
            ]}
          />
          <Accordion
            text="Kordinat"
            items={[
              {
                title: "ODC",
                to: "/kordinat/odc",
                allow: ["admin-ta", "ta-maintenance"],
              },
              {
                title: "ODP",
                to: "/kordinat/odp",
                allow: ["admin-ta", "ta-maintenance"],
              },
              {
                title: "OCC",
                to: "/kordinat/occ",
                allow: ["admin-ta", "ta-maintenance"],
              },
            ]}
          />
        </div>
      </div>

      <div className="w-full row-span-2 px-8 inline-flex">
        <SidebarNav to={"/auth/logout"}>Logout</SidebarNav>
      </div>
    </nav>
  );
}
