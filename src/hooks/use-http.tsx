import { useState, useCallback } from "react";
import { RequestConfig } from "../types/HttpHook.d";

/**
 * Since fetch is being used a bunch of times, might as well
 * extract the repeated code to an utility fetch function
 *
 * @returns custom hook for http calls
 */
const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (requestConfig: RequestConfig, applyData: (data: any) => void) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(requestConfig.url, {
          method: requestConfig.method ? requestConfig.method : "GET",
          headers: requestConfig.headers ? requestConfig.headers : {},
          body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 404 ? "Resource not found" : "Request failed!"
          );
        }

        const data = await response.json();

        applyData(data);
      } catch (error: any) {
        setError(error.message || "Something went wrong!");
      }

      setIsLoading(false);
    },
    []
  );

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
