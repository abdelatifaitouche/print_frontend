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
    .then((reponse) => {
        console.log(response)
    })
    .catch((error)=>{
        console.log(error)
    });
};


