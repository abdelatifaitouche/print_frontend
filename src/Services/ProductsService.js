import AXIOS_CONFIG from "@/config/axiosConfig";

/* ================= GET ALL ================= */
/**
 * Get products with optional filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number (default: 1)
 * @param {string} params.status - Filter by status
 * @param {string} params.category - Filter by category
 * @param {boolean} params.all - Get all products without pagination (default: false)
 * @returns {Promise} Response with [products, pagination]
 */
export const getProducts = async ({ page = 1, status = "", category = "", all = false } = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (all) {
      // When all=True, backend returns all products
      params.append("all", "True");
    } else {
      // Regular pagination
      if (page) params.append("page", page);
    }
    
    if (status) params.append("status", status);
    if (category) params.append("category", category);

    const response = await AXIOS_CONFIG.get(`/products?${params.toString()}`);
    
    // Response structure: [products_array, { page, total_items }]
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
