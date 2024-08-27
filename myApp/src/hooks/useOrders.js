import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { baseURL } from "../Shared";

export default function useOrders(customerId) {
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
        if (response.status === 404) {
          return null; //if no orders on customer
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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

  // GET orders
  const request = useCallback(async () => {
    const signal = createAbortController();

    try {
      const response = await fetch(
        `${baseURL}/api/customers/${customerId}/orders/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access"),
          },
          signal,
        }
      );
      const result = await handleResponse(response);
      if (result) {
        return result.orders || [];
      }
    } catch (error) {
      if (error.name === "AbortError") {
      } else {
        setErrorStatus(error.message);
      }
    }
    return [];
  }, [handleResponse]);

  // POST order
  const appendData = useCallback(
    async (newData) => {
      const signal = createAbortController();

      try {
        const response = await fetch(
          `${baseURL}/api/customers/${customerId}/orders/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("access"),
            },
            body: JSON.stringify(newData),
            signal,
          }
        );

        const result = await handleResponse(response);

        if (result) {
          return result.order;
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

  return { request, appendData, errorStatus };
}
