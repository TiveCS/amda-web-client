import Sidebar from "@components/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <>
      <div className="min-h-screen min-w-full grid grid-cols-10 font-poppins">
        <div className="col-span-2">
          <Sidebar />
        </div>

        <div className="col-span-8 w-full px-8">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
