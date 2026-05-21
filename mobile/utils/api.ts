import { AxiosInstance } from "axios";

export const userApi = {
  syncUser: (api: AxiosInstance) => api.post("/auth/callback"),
};

export const chatApi = {
  getChats: (api: AxiosInstance) => api.get("/chats"),
};
