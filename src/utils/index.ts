import dayjs from "dayjs";
import dayjsUTC from "dayjs/plugin/utc";
import dayjsTimezone from "dayjs/plugin/timezone";
import { RoleType } from "../types";

dayjs.extend(dayjsUTC);
dayjs.extend(dayjsTimezone);

export function amdaDayJs() {
  return dayjs;
}

export function numberWithSeparator(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatTimeInput(hours: number, minutes: number) {
  if (hours < 0 || hours > 23) {
    throw new Error("Hours must be between 0 and 23");
  }

  if (minutes < 0 || minutes > 59) {
    throw new Error("Minutes must be between 0 and 59");
  }

  const hoursString = hours.toString().padStart(2, "0");
  const minutesString = minutes.toString().padStart(2, "0");

  return `${hoursString}:${minutesString}`;
}

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
