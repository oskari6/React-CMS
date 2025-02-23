import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Shared";

export function useOrders(customerId, orderId) {
  const queryClient = useQueryClient();

  // GET all orders
  const { data, error, status } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/api/orders/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const result = await res.json();
      return result.orders;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // POST order
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
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
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
      const result = await res.json();
      return result.order;
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
      queryClient.invalidateQueries(["orders"]);
    },
  });

  return { data, createOrder, updateOrder, deleteOrder, error, status };
}

export function useOrder(customerId, orderId) {
  const navigate = useNavigate();

  // GET all orders for customer
  const { customerOrders, error1, status1 } = useQuery({
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
      const result = await res.json();
      return result.orders;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // GET order of a customer
  const { customerOrder, error2, status2 } = useQuery({
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
      const result = await res.json();
      return result.order;
    },
  });
  return { customerOrders, customerOrder, error1, status1, error2, status2 };
}
