import { useApiClient } from "@/lib/axios";
import { userApi } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";

export const useAuthCallback = () => {
  const api = useApiClient();

  return useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) =>
      console.log("User synced successfully:", response.data),
    onError: (error: any) => {
      console.log("User sync failed:", error.response?.data || error.message);
    },
  });
};
