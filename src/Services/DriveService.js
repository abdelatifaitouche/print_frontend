import AXIOS_CONFIG from "@/config/axiosConfig";




export const getDriveFolders = async () =>{
    try{
        const response = await AXIOS_CONFIG.get('drive/')
        console.log(response.data)
        return response.data
    }catch(error){
        console.log(error)
    }
}



export const getFolderContents = async (folderId) =>{
    try{

        const response = await AXIOS_CONFIG.get(`drive/${folderId}`);
        console.log(response.data)
        return response.data
    }catch(error){
        console.log(error)
    }
}