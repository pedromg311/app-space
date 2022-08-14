export type RequestConfig = {
  url: string;
  method: "GET" | "POST" | "PUT";
  headers?: HeadersInit;
  body?: BodyInit | null;
};
