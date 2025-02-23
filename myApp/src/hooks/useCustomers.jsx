import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Shared";

export function useCustomers() {
  const queryClient = useQueryClient();

  // GET customers
  const {
    data: customers,
    error,
    status,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/api/customers/`, {
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

  // POST customer
  const createCustomer = useMutation({
    mutationFn: async (newCustomer) => {
      const res = await fetch(`${baseURL}/api/customers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(newCustomer),
      });
      if (!res.ok) throw new Error("Failed to create customer");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]); // Refresh the customer list
    },
  });

  // PATCH customer
  const updateCustomer = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const res = await fetch(`${baseURL}/api/customers/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update customer");
      return res.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(["customer", id]); // Refresh single customer
      queryClient.invalidateQueries(["customers"]); // Refresh customer list
    },
  });

  // DELETE customer
  const deleteCustomer = useMutation({
    mutationFn: async (id) => {
      await fetch(`${baseURL}/api/customers/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["customers"]); // Refresh the list
    },
  });

  return {
    customers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    error,
    status,
  };
}

export function useCustomer(id) {
  const navigate = useNavigate();

  // GET customer
  const {
    data: customer,
    error,
    status,
  } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/api/customers/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
      if (res.status === 401) {
        navigate("/customers", {
          state: { previousUrl: `/customers/${id}` },
        });
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch customer");
      return res.json();
    },
  });
  return { customer, error, status };
}
