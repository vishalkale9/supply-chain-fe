import apiClient from "../utils/api.js";

// Get users by role
export const getUsersByRole = async (role) => {
  try {
    const response = await apiClient.get(`/users?role=${role}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
