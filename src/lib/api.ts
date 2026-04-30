const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function getAuthToken(): string | null {
  try {
    const raw = localStorage.getItem("cbe_auth_token");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  console.log("URL: ", url);
  const response = await fetch(url, {
    ...options,
    headers,
  });
  console.log("RESPONSE FROM API:MESSAGEW FROM😂😂😂😂😂😂  ", response);

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((err: any) => {
          const field = err.loc[err.loc.length - 1];
          return `${field}: ${err.msg}`;
        }).join(', ');
      } else {
        errorMessage = errorData.detail || errorData.message || errorMessage;
      }
    } catch {
      // If parsing json fails, use status text
      errorMessage = response.statusText;
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  // Check if response has content before parsing JSON
  const text = await response.text();
  console.log("MESSAGEW FROM😂😂😂😂😂😂 ", text);
  return text ? JSON.parse(text) : null;
}
