const API_BASE_URL = "http://127.0.0.1:8000";

type RequestBody = object;

interface ApiRequestOptions {
  method: "DELETE" | "GET" | "POST" | "PUT";
  body?: RequestBody;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function request<T>(path: string, { method, body }: ApiRequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const apiClient = {
  delete: (path: string): Promise<void> => request<void>(path, { method: "DELETE" }),
  get: <T>(path: string): Promise<T> => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: RequestBody): Promise<T> =>
    request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: RequestBody): Promise<T> =>
    request<T>(path, { method: "PUT", body }),
};
