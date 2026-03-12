import AXIOS_CONFIG from "@/config/axiosConfig";


export const createDevis = async (data) => {
  try {
    const response = await AXIOS_CONFIG.post("/documents/create/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create devis:", error);
    throw error;
  }
};

export const getOrderDocuments = async (orderId) => {
  try {
    const response = await AXIOS_CONFIG.get(`/documents/${orderId}/documents`);
    
    // Response structure: [documents_array, { page, total_pages, total_items }]
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch documents for order ${orderId}:`, error);
    throw error;
  }
};

export default {
  createDevis,
  getOrderDocuments
};