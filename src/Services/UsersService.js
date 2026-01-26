import AXIOS_CONFIG from "@/config/axiosConfig";

const getUsers = async () => {
  try {
    const response = await AXIOS_CONFIG.get("auth/users");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error; // ← better to let caller handle it
  }
};

export default getUsers;

export const createUser = (user_data) => {
  return AXIOS_CONFIG.post("auth/register_user/", user_data)
    .then((response) => {
      console.log("User created:", response);
      return response.data; // ← usually good to return the created data
    })
    .catch((error) => {
      console.error("Error creating user:", error);
      throw error;
    });
};

export const getUserDetails = async (id) => {
  try {
    const response = await AXIOS_CONFIG.get(`auth/users/${id}`);
    console.log("User details:", response);
    return response.data; // ← most likely you want .data
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
};

// ────────────────────────────────────────────────
// NEW / IMPROVED updateUser function
// ────────────────────────────────────────────────
export const updateUser = async (userId, data) => {
  try {
    const response = await AXIOS_CONFIG.patch(`auth/users/${userId}/`, data);
    console.log(data)
    console.log(`User ${userId} updated:`, response);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

export const blockUser = (id) =>
  AXIOS_CONFIG.post(`/users/blockuser/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Block failed:", err);
      throw err;
    });

export const unblockUser = (id) =>
  AXIOS_CONFIG.post(`/users/unblockUser/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Unblock failed:", err);
      throw err;
    });

export const deleteUser = (id) =>
  AXIOS_CONFIG.delete(`/users/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Delete failed:", err);
      throw err;
    });

export const AdminchangeUserPassword = (id, data) =>
  AXIOS_CONFIG.post(`/users/change-password/${id}/`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error("Password change failed:", err);
      throw err;
    });