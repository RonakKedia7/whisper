import { AxiosInstance } from "axios";

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/auth/callback"),
};
