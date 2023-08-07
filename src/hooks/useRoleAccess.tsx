import { RoleType } from "../types";
import { checkRoleAllowed } from "../utils";

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
