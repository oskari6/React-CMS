import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Shared";
import { useState } from "react";

export default function useCustomer(id) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorStatus, setErrorStatus] = useState(null);

  // Fetch customer (GET request)
  const { data } = useQuery({
    queryKey: ["customer", id],
    queryFn: () =>
      fetch(`${baseURL}/api/customers/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (res.status === 401) {
          navigate("/login", { state: { previousUrl: `/customers/${id}` } });
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch customer");
        }
        return res.json();
      }),
    onError: (error) => {
      setErrorStatus(error);
    },
  });

  // PATCH update customer
  const updateCustomer = useMutation({
    mutationFn: (updatedCustomer) =>
      fetch(`${baseURL}/api/customers/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(updatedCustomer),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update customer");
        }
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", id] });
    },
    onError: (error) => {
      console.error("Error updating customer: ", error);
      setErrorStatus(error);
    },
  });

  // DELETE customer
  const deleteCustomer = useMutation({
    mutationFn: () =>
      fetch(`${baseURL}/api/customers/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete customer");
        }
        return res.text().then((text) => {
          return text ? JSON.parse(text) : {};
        });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/customers/");
    },
    onError: (error) => {
      console.error("Error deleting customer: ", error);
      setErrorStatus(error);
    },
  });

  return {
    data,
    errorStatus,
    updateCustomer,
    deleteCustomer,
  };
}
