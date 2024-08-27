import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Shared";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useOrders(customerId, orderId) {
  const [errorStatus, setErrorStatus] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // GET order
  const { data } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      fetch(`${baseURL}/api/customers/${customerId}/orders/${orderId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (res.status === 401) {
          navigate("/login", { state: { previousUrl: `/orders/` } });
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch order");
        }
        return res.json();
      }),
    onError: (error) => {
      setErrorStatus(error);
    },
  });

  // PATCH order
  const updateOrder = useMutation({
    mutationFn: (updatedOrder) => {
      let body;
      let headers = {
        Authorization: "Bearer " + localStorage.getItem("access"),
      };
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(updatedOrder);

      return fetch(
        `${baseURL}/api/customers/${customerId}/orders/${orderId}/`,
        {
          method: "PATCH",
          headers,
          body,
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update order");
        }
        return res.json().then((data) => data.order);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("order");
    },
    onError: (error) => {
      setErrorStatus(error);
    },
  });

  // DELETE order
  const deleteOrder = useMutation({
    mutationFn: () =>
      fetch(`${baseURL}/api/customers/${customerId}/orders/${orderId}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete order");
        }
        return res.text().then((text) => {
          return text ? JSON.parse(text) : {};
        });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("order");
      navigate("/orders/");
    },
    onError: (error) => {
      setErrorStatus(error);
    },
  });
  return { data, errorStatus, updateOrder, deleteOrder };
}
