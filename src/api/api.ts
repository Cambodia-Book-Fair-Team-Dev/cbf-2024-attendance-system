export const API_BASE_URL = "http://127.0.0.1:8000";

const fetchApi = async (endpoint: any, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "An error occurred");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("API Error:", error.message);
    } else {
      console.error("API Error:", error);
    }
    throw error;
  }
};

export default fetchApi;
