import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../Shared";

export function useItems() {
  const queryClient = useQueryClient();

  // GET items
  const { data, error, status } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/api/items/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch items");
      const result = await res.json();
      return result.items;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // POST order
  const createItem = useMutation({
    mutationFn: async (newOrder) => {
      const res = await fetch(`${baseURL}/api/items/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(newOrder),
      });
      if (!res.ok) throw new Error("Failed to create item");
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
    },
  });

  return { data, createItem, error, status };
}
