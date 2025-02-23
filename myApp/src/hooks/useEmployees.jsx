import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../Shared";

export function useEmployees() {
  const queryClient = useQueryClient();

  // GET employees
  const { data, error, status } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/api/employees/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
      if (!res.ok) throw new Error("Failed to fetch customers");
      const result = await res.json();
      return result.employees;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // POST employee
  const createEmployee = useMutation({
    mutationFn: async (newEmployee) => {
      let body;
      let headers = {
        Authorization: "Bearer " + localStorage.getItem("access"),
      };
      if (newEmployee.picture) {
        body = new FormData();
        for (let key in newEmployee) {
          body.append(key, newEmployee[key]);
        }
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(newEmployee);
      }
      const res = await fetch(`${baseURL}/api/employees/`, {
        method: "POST",
        headers,
        body,
      });
      if (!res.ok) throw new Error("Failed to create employee");
      const result = await res.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });

  // PATCH update employee
  const updateEmployee = useMutation({
    mutationFn: async ({ id, updatedData }) => {
      let temp;
      let headers = {
        Authorization: "Bearer " + localStorage.getItem("access"),
      };

      if (updatedData.picture) {
        temp = new FormData();
        for (let key in updatedData) {
          temp.append(key, updatedData[key]);
        }
      } else {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(`${baseURL}/api/employees/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(temp),
      });
      if (!res.ok) throw new Error("Failed to update employee");
      const result = await res.json();
      return result.employee;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries("employees");
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
  });

  // DELETE employee
  const deleteEmployee = useMutation({
    mutationFn: async (id) => {
      await fetch(`${baseURL}/api/employees/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });

  return {
    data,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    error,
    status,
  };
}

export function useEmployee(id) {
  const navigate = useNavigate();

  const { data, error, status } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await fetch(`${baseURL}/api/employees/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      });
      if (res.status === 401) {
        navigate("/employees", {
          state: { previousUrl: `/employees/${id}` },
        });
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error("Failed to fetch employee");
      const result = await res.json();
      return result.employee;
    },
  });
  return { data, error, status };
}
