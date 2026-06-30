import apiClient from "../utils/api.js";

// Fetch all notifications for the logged-in user
export const getMyNotifications = async () => {
  try {
    const response = await apiClient.get("/notifications");
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Mark a specific notification as read
export const markNotificationAsRead = async (id) => {
  try {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
