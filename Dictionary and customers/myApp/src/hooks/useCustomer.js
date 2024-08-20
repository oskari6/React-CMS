import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Shared";

export default function useCustomer(id) {
  const [tempResource, setTempResource] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch customer (GET request)
  const { data, isError, error } = useQuery(
    ["customer", id],
    () =>
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
    {
      onSuccess: (data) => setTempResource(data),
    }
  );

  // Update customer (PATCH request)
  const updateResource = useMutation(
    (updatedCustomer) =>
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
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customer", id]);
        setTempResource(null);
      },
      onError: (error) => {
        console.error("Error updating customer: ", error);
      },
    }
  );

  // Delete customer (DELETE request)
  const deleteResource = useMutation(
    () =>
      fetch(`${baseURL}/api/customers/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete customer");
        }
        return res.json();
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customers"]);
        navigate("/customers/");
      },
      onError: (error) => {
        console.error("Error deleting customer: ", error);
      },
    }
  );

  return {
    data,
    tempResource,
    isError,
    error,
    updateResource,
    deleteResource,
  };
}
