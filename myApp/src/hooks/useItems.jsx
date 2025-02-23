import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../Shared";

export function useItems() {
  // GET items
  const {
    data: items,
    error,
    status,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/api/items/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch customers");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return { items, error, status };
}
