import apiClient from "../utils/api.js";

// Create a New Shipment (Usually Admin/Warehouse)
export const createShipment = async (shipmentData) => {
  try {
    const response = await apiClient.post("/transport/", shipmentData);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// View My Assigned Shipments
export const getMyShipments = async () => {
  try {
    const response = await apiClient.get("/transport/transporter");
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Shipment Status
export const updateShipmentStatus = async (shipmentId, status) => {
  try {
    const response = await apiClient.put(`/transport/${shipmentId}/status`, {
      status,
    });
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get a Single Shipment's Details
export const getShipmentById = async (shipmentId) => {
  try {
    const response = await apiClient.get(`/transport/${shipmentId}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Shipment by Order ID
export const getShipmentByOrderId = async (orderId) => {
  try {
    const response = await apiClient.get(`/transport/order/${orderId}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
