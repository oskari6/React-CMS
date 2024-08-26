import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../Shared";

export default function useCustomers() {
  const [data, setData] = useState({ customers: [] });
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

  // GET customers
  const request = useCallback(async () => {
    const signal = createAbortController();

    try {
      const response = await fetch(`${baseURL}/api/customers/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access"),
        },
        signal,
      });
      const result = await handleResponse(response);
      if (result) {
        setData(result.customers || []);
        return result.customers || [];
      }
    } catch (error) {
      if (error.name === "AbortError") {
      } else {
        setErrorStatus(error.message);
      }
    }
  }, [handleResponse]);

  // POST customer
  const appendData = useCallback(
    async (newData) => {
      const signal = createAbortController();

      try {
        const response = await fetch(`${baseURL}/api/customers/`, {
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
          setData((prevData) => [...prevData, result.customer]);
          return result.customer;
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
