import AXIOS_CONFIG from "@/config/axiosConfig";

export const get_order_analytics = async () => {
  try {
    const response = await AXIOS_CONFIG.get(`/dashboard`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch analitycs`, error);
    throw error;
  }
};
