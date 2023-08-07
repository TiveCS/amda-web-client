import { RoleType } from "../types";

export function checkRoleAllowed(
  role: RoleType | null | undefined,
  options?: {
    blackListedRoles?: RoleType[];
    whiteListedRoles?: RoleType[];
  }
) {
  if (!role) return false;
  if (role === "super-admin") return true;

  const hasWhiteListedRoles = options?.whiteListedRoles?.length ?? 0 > 0;
  const hasBlackListedRoles = options?.blackListedRoles?.length ?? 0 > 0;

  const isBlackListed = options?.blackListedRoles?.includes(role) ?? false;
  const isWhiteListed = options?.whiteListedRoles?.includes(role) ?? false;

  if (hasBlackListedRoles && isBlackListed) return false;

  if (hasBlackListedRoles && !isBlackListed) return true;

  if (hasWhiteListedRoles && isWhiteListed) return true;

  if (hasWhiteListedRoles && !isWhiteListed) return false;

  return true;
}
