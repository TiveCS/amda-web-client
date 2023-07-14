import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <>
      <p>auth</p>
      <Outlet />
    </>
  );
}

export default AuthLayout;
