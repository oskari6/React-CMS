import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//custom hook
export default function useFetch(
  baseURL,
  { method = "GET", headers = {}, body = null } = {}
) {
  const [data, setData] = useState();
  const [errorStatus, setErrorStatus] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef(null);

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
        throw response.status;
      }
      return response.json();
    },
    [navigate, location]
  );

  const createAbortController = () => {
    abortControllerRef.current = new AbortController();
    return abortControllerRef.current.signal;
  };

  const request = useCallback(
    async (url = baseURL) => {
      const signal = createAbortController();
      setLoading(true);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal,
        });
        const result = await handleResponse(response);
        if (result) setData(result);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch request cancelled");
        } else setErrorStatus(error);
      } finally {
        setLoading(false);
      }
    },
    [baseURL, method, headers, body, handleResponse]
  );

  const appendData = useCallback(
    async (newData, key, url = baseURL) => {
      const signal = createAbortController();
      setLoading(true);

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
          signal,
        });

        const result = await handleResponse(response);
        if (result) {
          setData((prevData) => ({
            ...prevData,
            [key]: [...prevData(prevData[key] || []), result],
          }));
        }
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch request cancelled");
        } else setErrorStatus(error);
      } finally {
        setLoading(false);
      }
    },
    [baseURL, headers, handleResponse]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { request, appendData, data, errorStatus, loading }; //{} instead of [] lets you have properties with the same names and allows destructuring
  //less chance of typing incorrectly
}
