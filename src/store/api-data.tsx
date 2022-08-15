import React from "react";

/**
 * Might be a bit overkill to have this here, but
 * i wanted to ensure that if in the hypothetical
 * future where maybe a login and more data that is required
 * by the API would exist, i would add all of that here.
 *
 */
const initialState = {
  apiKey: "6b9027442105cbeb1f7fcc26400eec8f",
};

export const Api = React.createContext<{
  apiKey: string;
}>(initialState);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = (props) => {
  return (
    <Api.Provider
      value={{
        apiKey: initialState.apiKey,
      }}
    >
      {props.children}
    </Api.Provider>
  );
};
