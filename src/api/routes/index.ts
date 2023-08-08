const VITE_API_URL = import.meta.env.VITE_API_URL as string;
export const API_URL = `${VITE_API_URL ? VITE_API_URL : ""}/api`;

export const APP_PING_URL = `${API_URL}`;

export const AUTH_LOGIN_URL = `${API_URL}/auth/login`;
export const AUTH_REGISTER_URL = `${API_URL}/auth/register`;
export const AUTH_PROFILE_URL = `${API_URL}/auth/profile`;
export const AUTH_LOGOUT_URL = `${API_URL}/auth/logout`;
export const AUTH_CHECK_URL = `${API_URL}/auth/check`;
export const AUTH_ROLE_URL = `${API_URL}/auth/role`;

export const MANAGEMENT_MITRA_URL = `${API_URL}/management/mitra`;

export const MANAGEMENT_USERS_URL = `${API_URL}/management/users`;

export const MANAGEMENT_ROLES_URL = `${API_URL}/management/roles`;

export const STO_URL = `${API_URL}/sto`;

export const DESIGNATOR_URL = `${API_URL}/designators`;

export const LOPS_URL = `${API_URL}/lops`;
export const LOPS_ACTIVITIES_URL = `${API_URL}/lops/activities`;

export const AGENDAS_URL = `${API_URL}/agendas`;

export const LOPS_TICKETS_URL = `${API_URL}/lops/tickets`;

export const BOQ_REPORTS_URL = `${API_URL}/boq/reports`;
