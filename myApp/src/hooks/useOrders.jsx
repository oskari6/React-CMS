import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Shared";

export function useOrders(customerId, orderId) {
  const queryClient = useQueryClient();

  // GET customers
  const {
    data: orders,
    error,
    status,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch(
        `${baseURL}/api/customers/${customerId}/orders/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // POST customer
  const createOrder = useMutation({
    mutationFn: async (newOrder) => {
      const res = await fetch(
        `${baseURL}/api/customers/${customerId}/orders/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
          body: JSON.stringify(newOrder),
        }
      );
      if (!res.ok) throw new Error("Failed to create order");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]); // Refresh the customer list
    },
  });

  //PATCH order
  const updateOrder = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await fetch(
        `${baseURL}/api/customers/${customerId}/orders/${id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
          body: JSON.stringify(updatedData),
        }
      );
      if (!res.ok) throw new Error("Failed to update order");
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["order", id]);
      queryClient.invalidateQueries(["orders"]);
    },
  });

  // DELETE customer
  const deleteOrder = useMutation({
    mutationFn: async (id) => {
      await fetch(`${baseURL}/api/customers/${customerId}/orders/${orderId}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]); // Refresh the list
    },
  });

  return { orders, createOrder, updateOrder, deleteOrder, error, status };
}

export function useOrder(customerId, orderId) {
  const navigate = useNavigate();

  // GET order
  const {
    data: order,
    error,
    status,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await fetch(
        `${baseURL}/api/customers/${customerId}/orders/${orderId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
        }
      );
      if (res.status === 401) {
        navigate("/orders", {
          state: { previousUrl: `/orders/${orderId}` },
        });
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch order");
      return res.json();
    },
  });
  return { order, error, status };
}
