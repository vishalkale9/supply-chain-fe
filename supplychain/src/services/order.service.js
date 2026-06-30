import apiClient from "../utils/api.js";

// View Incoming Orders (Supplier Orders)
export const getSupplierOrders = async () => {
  try {
    const response = await apiClient.get("/orders/supplier-orders");
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Order Status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/status`, {
      status,
    });
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
