import { useApiClient } from "@/lib/axios";
import { Chat } from "@/types";
import { chatApi } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const useChats = () => {
  const api = useApiClient();

  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => (await chatApi.getChats(api)).data,
  });
};
