import axios from "axios";

// Track refreshing
let isRefreshing = false;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !isRefreshing) {
      try {
        isRefreshing = true;

        // fix flickering and reloading, renew accessToken
        // Use separate axios instance to avoid circular dependency
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/renew-access-token`,
          {},
          { withCredentials: true }
        );

        if (response.status === 200) {
          // Store current URL and any important state before reload
          if (typeof window !== "undefined") {
            //  Store current scroll position
            sessionStorage.setItem("scrollPosition", window.scrollY.toString());

            // Reload to current URL (maintains the URL they were on)
            window.location.reload();
          }
        } else {
          throw new Error("Failed to renew access token");
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        // Redirect to login only if not already there
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          // Optional: Store the current URL to redirect back after login
          sessionStorage.setItem("redirectUrl", window.location.href);
          window.location.href = "/login";
        }
      } finally {
        isRefreshing = false;
      }
    }

    // If already refreshing, just reject (don't trigger multiple refreshes)
    if (isRefreshing && error.response?.status === 401) {
      return Promise.reject(new Error("Token refresh in progress"));
    }

    return Promise.reject(error);
  }
);

export default api;
