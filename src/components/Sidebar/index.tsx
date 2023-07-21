import React from "react";
import NavAccordion from "./NavAccordion";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="grid min-h-screen col-span-2 grid-rows-6 px-6 text-white bg-red-800">
      <div className="row-span-1 mt-4 text-center">
        <Link to={"/"} className="text-xl font-semibold">
          AMDA
        </Link>
      </div>

      <div className="flex flex-col w-full row-span-4 gap-y-6">
        <NavAccordion
          title="Management"
          links={[
            {
              label: "Users",
              route: "management.users",
            },
            {
              label: "Mitra",
              route: "management.mitras",
            },
          ]}
        />
      </div>

      <div className="row-span-2">
        <form>
          <button type="submit">Log Out</button>
        </form>
      </div>
    </nav>
  );
}
