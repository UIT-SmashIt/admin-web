import {useQuery} from "@tanstack/react-query";
import {fetchAdmins} from "../api/admin.api.ts";

export const useFetchAdmins = () => {
  return useQuery({
    queryKey: ['admins'],
    queryFn: fetchAdmins
  });
}