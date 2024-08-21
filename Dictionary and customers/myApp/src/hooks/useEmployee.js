import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../Shared";
import { LoginContext } from "../App";
import { useContext } from "react";

export default function useEmployee(id) {
  const queryClient = useQueryClient();
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();

  //GET
  const { data, isError, error, loading } = useQuery(
    ["employee", id],
    () =>
      fetch(`${baseURL}/api/employees/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (res.status === 401) {
          setLoggedIn(false);
          navigate("/login", { state: { previousUrl: location.pathname } });
          throw new Error("Unauthorized");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch employee");
        }
        return res.json();
      }),
    {
      enabled: !!id, // Only run the query if id is provided
    }
  );

  //PATCH
  const updateEmployee = useMutation(
    (updatedData) =>
      fetch(`${baseURL}/api/employees/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        body: JSON.stringify(updatedData),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update employee");
        }
        return res.json();
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["employee", id]);
      },
      onError: (error) => {
        console.error("Error updating employee: ", error);
      },
    }
  );

  //DELETE
  const deleteEmployee = useMutation(
    () =>
      fetch(`${baseURL}/api/employees/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete employee");
        }
        return res.json();
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("employees");
        navigate("/employees/");
      },
      onError: (error) => {
        console.error("Error deleting employee: ", error);
      },
    }
  );
  return { data, isError, error, loading, updateEmployee, deleteEmployee };
}
