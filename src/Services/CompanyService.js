// src/Services/CompanyService.js
import AXIOS_CONFIG from "@/config/axiosConfig";

// ────────────────────────────────────────────────
// Get all companies
// ────────────────────────────────────────────────
export const getCompanies = async () => {
  try {
    const response = await AXIOS_CONFIG.get("/company/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    throw error;           // ← let the component show error message / toast
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