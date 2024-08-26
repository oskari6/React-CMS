import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../Shared";

export default function useEmployees() {
  const [errorStatus, setErrorStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const abortControllerRef = useRef(null);

  // Handle HTTP response and errors
  const handleResponse = useCallback(
    async (response) => {
      if (response.status === 401) {
        navigate("/login", {
          state: {
            previousUrl: location.pathname,
          },
        });
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },
    [navigate, location]
  );

  //http error handled gracefully
  const createAbortController = () => {
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  };

  // GET employees
  const request = useCallback(async () => {
    const signal = createAbortController();

    try {
      const response = await fetch(`${baseURL}/api/employees/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        signal,
      });
      const result = await handleResponse(response);
      if (result) {
        return result.employees || [];
      }
    } catch (error) {
      if (error.name === "AbortError") {
      } else {
        setErrorStatus(error.message);
      }
    }
    return [];
  }, [handleResponse]);

  // POST employee
  const appendData = useCallback(
    async (newData) => {
      const signal = createAbortController();
      try {
        let body;
        let headers = {
          Authorization: "Bearer " + localStorage.getItem("access"),
        };
        if (newData.picture) {
          body = new FormData();
          for (let key in newData) {
            body.append(key, newData[key]);
          }
        } else {
          headers["Content-Type"] = "application/json";
          body = JSON.stringify(newData);
        }
        const response = await fetch(`${baseURL}/api/employees/`, {
          method: "POST",
          headers,
          body,
          signal,
        });

        const result = await handleResponse(response);

        if (result) {
          return result.employee;
        }
      } catch (error) {
        if (error.name === "AbortError") {
        } else {
          setErrorStatus(error.message);
        }
      }
    },
    [handleResponse]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { request, appendData, errorStatus }; //{} instead of [] lets you have properties with the same names and allows destructuring
  //less chance of typing incorrectly
}
