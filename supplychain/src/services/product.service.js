import apiClient from "../utils/api.js";

// Add New Product / Batch (Inventory)
export const createProduct = async (productData) => {
  try {
    const response = await apiClient.post("/products/create", productData);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// View Supplier's Inventory (My Products)
export const getMyInventory = async () => {
  try {
    const response = await apiClient.get("/products/my-inventory");
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Transfer Product (To Transporter or Warehouse)
export const transferProduct = async (transferData) => {
  try {
    const response = await apiClient.put("/products/transfer", transferData);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
