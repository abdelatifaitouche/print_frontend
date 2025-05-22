import AXIOS_CONFIG from "@/config/axiosConfig";

const getUsers = async () => {
  try {
    const response = await AXIOS_CONFIG.get("users/usersList/");
    return response.data;
  } catch (error) {}
};

export default getUsers;

export const createUser = (user_data) => {
  AXIOS_CONFIG.post("auth/createUser/", user_data)
    .then((response) => {
        console.log(response)
    })
    .catch((error)=>{
        console.log(error)
    });
};


export const getUserDetails = (id) => AXIOS_CONFIG.get(`users/userDetails/${id}`);
export const updateUser = (id, data) => AXIOS_CONFIG.patch(`users/userDetails/${id}`, data);
export const blockUser = (id) =>
  AXIOS_CONFIG.post(`/users/blockuser/${id}`);

export const unblockUser = (id) =>
  AXIOS_CONFIG.post(`/users/unblockUser/${id}`);

export const deleteUser = (id) =>
  AXIOS_CONFIG.delete(`/users/userDetails/${id}`);

export const AdminchangeUserPassword = (id, data) =>
  AXIOS_CONFIG.post(`/users/change-password/${id}/`, data);

