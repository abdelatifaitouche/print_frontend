import AXIOS_CONFIG from "@/config/axiosConfig";

/* ================= GET ALL ================= */
export const getProducts = async () => {
  try {
    const response = await AXIOS_CONFIG.get("products/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error;
  }
};

/* ================= GET BY ID ================= */
export const getProductById = async (id) => {
  try {
    const response = await AXIOS_CONFIG.get(`products/product/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    throw error;
  }
};

/* ================= CREATE ================= */
export const createProduct = async (payload) => {
  try {
    const response = await AXIOS_CONFIG.post("products/", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
};

/* ================= UPDATE (PATCH) ================= */
export const updateProduct = async (id, payload) => {
  try {
    const response = await AXIOS_CONFIG.patch(`products/product/${id}/`, payload);
    return response.data;
  } catch (error) {
    console.error("Failed to update product:", error);
    throw error;
  }
};

/* ================= DELETE ================= */
export const deleteProduct = async (id) => {
  try {
    await AXIOS_CONFIG.delete(`products/${id}/`);
  } catch (error) {
    console.error("Failed to delete product:", error);
    throw error;
  }
};
