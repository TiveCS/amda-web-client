const VITE_API_URL = import.meta.env.VITE_API_URL as string;
export const API_URL = import.meta.env.PROD ? `${VITE_API_URL}/api` : "/api";

export const APP_PING_URL = `/`;

export const AUTH_LOGIN_URL = `/auth/login`;
export const AUTH_REGISTER_URL = `/auth/register`;
export const AUTH_PROFILE_URL = `/auth/profile`;
export const AUTH_LOGOUT_URL = `/auth/logout`;
export const AUTH_CHECK_URL = `/auth/check`;
export const AUTH_ROLE_URL = `/auth/role`;

export const MANAGEMENT_MITRA_URL = `/management/mitra`;

export const MANAGEMENT_USERS_URL = `/management/users`;

export const MANAGEMENT_ROLES_URL = `/management/roles`;

export const STO_URL = `/sto`;

export const DESIGNATOR_URL = `/designators`;

export const LOPS_URL = `/lops`;
export const LOPS_ACTIVITIES_URL = `/lops/activities`;

export const AGENDAS_URL = `/agendas`;

export const LOPS_TICKETS_URL = `/lops/tickets`;

export const BOQ_REPORTS_URL = `/boq/reports`;
