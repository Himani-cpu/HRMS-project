const API_URL = "http://127.0.0.1:8000";

export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  return res;
};
