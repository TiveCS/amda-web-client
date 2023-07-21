import { Link } from "react-router-dom";
import SidebarNav from "./SidebarNav";
import { useProfileStore } from "@zustand/profileStore";

export default function Sidebar() {
  const { profile } = useProfileStore();

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <nav className="bg-slate-900 h-full text-gray-50 grid grid-row-span-6">
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
        <div className="flex flex-col gap-y-4">
          <SidebarNav to={"/"}>Dashboard</SidebarNav>
          <SidebarNav to={"/management"}>Management</SidebarNav>
          <SidebarNav to={"/agenda"}>Agenda Tim</SidebarNav>
          <SidebarNav to={"/boq"}>BOQ</SidebarNav>
          <SidebarNav to={"/kordinat"}>ODP/ODC/OCC</SidebarNav>
        </div>
      </div>

      <div className="w-full row-span-2 px-8 inline-flex">
        <SidebarNav to={"/auth/logout"}>Logout</SidebarNav>
      </div>
    </nav>
  );
}
