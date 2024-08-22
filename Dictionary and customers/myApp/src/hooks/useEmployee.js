import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Shared";
import { useState } from "react";

export default function useEmployee(id) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorStatus, setErrorStatus] = useState(null);

  // Fetch employee (GET request)
  const { data } = useQuery({
    queryKey: ["employee", id],
    queryFn: () =>
      fetch(`${baseURL}/api/employees/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (res.status === 401) {
          navigate("/login", { state: { previousUrl: `/employees/${id}` } });
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch employee");
        }
        return res.json();
      }),
    onError: (error) => {
      setErrorStatus(error);
    },
  });

  // PATCH update employee
  const updateEmployee = useMutation({
    mutationFn: (updatedEmployee) =>
      fetch(`${baseURL}/api/employees/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(updatedEmployee),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update employee");
        }
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
    onError: (error) => {
      console.error("Error updating employee: ", error);
      setErrorStatus(error);
    },
  });

  // DELETE employee
  const deleteEmployee = useMutation({
    mutationFn: () =>
      fetch(`${baseURL}/api/employees/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete employee");
        }
        return res.text().then((text) => {
          return text ? JSON.parse(text) : {};
        });
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      navigate("/employees/");
    },
    onError: (error) => {
      console.error("Error deleting employee: ", error);
      setErrorStatus(error);
    },
  });

  return {
    data,
    errorStatus,
    updateEmployee,
    deleteEmployee,
  };
}
