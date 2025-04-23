import AXIOS_CONFIG from "@/config/axiosConfig";





const getUsers = async () => {
    try{
        const response = await AXIOS_CONFIG.get('users/usersList/') ; 
        return response.data
    }catch(error){

    }
}

export default getUsers ; 