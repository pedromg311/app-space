export const MAIN_PATH = "/characters";
export const DEFAULT_URL =
  "https://gateway.marvel.com:443/v1/public/characters";
export const API_KEY = "apikey=6b9027442105cbeb1f7fcc26400eec8f";
export const DEFAULT_SEARCH_PARAMS = "?orderBy=name&limit=12";

export const getDefaultURL = () => {
  return `${DEFAULT_URL}?${API_KEY}`;
};
