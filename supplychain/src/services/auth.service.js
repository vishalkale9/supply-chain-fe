import axiosInstance from "../api/axios";

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const registerUser = async (name, email, password, role) => {
  try {
    const response = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};
