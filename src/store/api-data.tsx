import React, { useCallback } from "react";

/**
 * Might be a bit overkill to have this here, but
 * i wanted to ensure that if in the hypothetical
 * future where maybe a login and more data that is required
 * by the API would exist, i would add all of that here.
 *
 * This could also be in a config file. No need to have it here.
 */
const initialState = {
  url: "https://gateway.marvel.com:443/v1/public/characters",
  apiKey: "apikey=6b9027442105cbeb1f7fcc26400eec8f",
  defaultSearchParams: "?orderBy=name&limit=12",
  getDefaultURL: () => "",
};

export const Api = React.createContext<{
  apiKey: string;
  url: string;
  defaultSearchParams: string;
  getDefaultURL: () => string;
    }>(initialState);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  const getDefaultURL = useCallback(() => {
    return `${initialState.url}${initialState.defaultSearchParams}&${initialState.apiKey}`;
  }, []);
  return (
    <Api.Provider
      value={{
        apiKey: initialState.apiKey,
        url: initialState.url,
        defaultSearchParams: initialState.defaultSearchParams,
        getDefaultURL,
      }}
    >
      {props.children}
    </Api.Provider>
  );
};
