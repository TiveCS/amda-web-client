import { useProfileStore } from "@zustand/profileStore";
import { Navigate } from "react-router-dom";

function GuardPage() {
  const profileStore = useProfileStore();
  const isAuth = profileStore.profile !== null;

  if (!isAuth) {
    console.log(profileStore.profile);

    return <Navigate to={"/auth/login"} />;
  }

  return (
    <div>
      <h1>Guard Page</h1>
    </div>
  );
}

export default GuardPage;
