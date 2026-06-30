import apiClient from "../utils/api.js";

// Register a New Warehouse (Usually Admin)
export const createWarehouse = async (warehouseData) => {
  try {
    const response = await apiClient.post("/warehouse/", warehouseData);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// View All Warehouses
export const getAllWarehouses = async () => {
  try {
    const response = await apiClient.get("/warehouse/");
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Specific Warehouse & Inventory
export const getWarehouseDetails = async (warehouseId) => {
  try {
    const response = await apiClient.get(`/warehouse/${warehouseId}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Warehouse Inventory (Add/Remove Stock)
export const updateWarehouseInventory = async (warehouseId, inventoryData) => {
  try {
    const response = await apiClient.put(
      `/warehouse/${warehouseId}/inventory`,
      inventoryData,
    );
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
