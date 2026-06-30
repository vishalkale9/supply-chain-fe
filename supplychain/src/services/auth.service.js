import apiClient from "../utils/api.js";

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("auth/register", userData);

    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (Credentials) => {
  try {
    const response = await apiClient.post("/auth/login", Credentials);

    if (response.data && response.data.data && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      // Optionally store the user stringified in local storage too!
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }

    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Logout function
export const logoutUser = () => {
  // Clear everything from local storage to sign out
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
