// src/Services/CompanyService.js
import AXIOS_CONFIG from "@/config/axiosConfig";

// ────────────────────────────────────────────────
// Get all companies
// ────────────────────────────────────────────────
export const getCompanies = async ({ page = 1, status = "", all = false } = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (all) {
      // When all=True, backend returns all companies
      params.append("all", "True");
    } else {
      // Regular pagination
      if (page) params.append("page", page);
    }
    
    if (status) params.append("status", status);

    const response = await AXIOS_CONFIG.get(`/company?${params.toString()}`);
    
    // Response structure: [companies_array, { page, total_items }]
    return response.data;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    throw error;
  }
};

// ────────────────────────────────────────────────
// Create a new company
// ────────────────────────────────────────────────
export const createCompany = async (data) => {
  try {
    const response = await AXIOS_CONFIG.post("/company/", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create company:", error);
    throw error;
  }
};

// ────────────────────────────────────────────────
// Get single company details
// ────────────────────────────────────────────────
export const getCompanyDetails = async (company_id) => {
  try {
    const response = await AXIOS_CONFIG.get(`/company/${company_id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch company ${company_id}:`, error);
    throw error;
  }
};

// ────────────────────────────────────────────────
// Update company
// ────────────────────────────────────────────────
export const updateCompany = async (company_id, data) => {
  try {
    const response = await AXIOS_CONFIG.patch(`/company/${company_id}/`, data);
    return response.data;
  } catch (error) {
    console.error(`Failed to update company ${company_id}:`, error);
    throw error;
  }
};

// ────────────────────────────────────────────────
// Delete company
// ────────────────────────────────────────────────
export const deleteCompany = async (company_id) => {
  try {
    await AXIOS_CONFIG.delete(`/company/${company_id}/`);
    return true; // success indicator (or return response if needed)
  } catch (error) {
    console.error(`Failed to delete company ${company_id}:`, error);
    throw error;
  }
};