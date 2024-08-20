import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../Shared";

export default function useEmployees() {
  const [data, setData] = useState({ employees: [] });
  const [errorStatus, setErrorStatus] = useState(null);
  const [loading, setLoading] = useState(false);
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

  // GET request to fetch all customers
  const request = useCallback(async () => {
    const signal = createAbortController();
    setLoading(true);

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
      if (result) setData({ customers: result });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch request cancelled");
      } else {
        setErrorStatus(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [baseURL, handleResponse]);

  // POST request to create a new customer
  const appendData = useCallback(
    async (newData) => {
      const signal = createAbortController();
      setLoading(true);

      try {
        const response = await fetch(`${baseURL}/api/employees/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
          body: JSON.stringify(newData),
          signal,
        });

        const result = await handleResponse(response);
        if (result) {
          setData((prevData) => ({
            employees: [...prevData.employees, result],
          }));
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch request cancelled");
        } else {
          setErrorStatus(error.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [baseURL, handleResponse]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  return {
    request,
    appendData,
    data,
    errorStatus,
    loading,
  };
}
