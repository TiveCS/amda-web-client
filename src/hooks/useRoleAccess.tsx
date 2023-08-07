import { useProfileStore } from "@zustand/profileStore";
import { RoleType } from "../types";
import { checkRoleAllowed } from "../utils";
import { Navigate } from "react-router-dom";

interface RoleAccessProps {
  blacklistRoles?: RoleType[];
  whitelistRoles?: RoleType[];
  role: string;
}

export default function useRoleAccess({
  role,
  blacklistRoles,
  whitelistRoles,
}: RoleAccessProps) {
  const isAllowed = checkRoleAllowed(role as unknown as RoleType, {
    blackListedRoles: blacklistRoles,
    whiteListedRoles: whitelistRoles,
  });

  return { isAllowed, role };
}
