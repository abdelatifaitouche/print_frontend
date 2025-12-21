import AXIOS_CONFIG from "@/config/axiosConfig";
import { data } from "react-router-dom";




const getCompanies = async () =>{
    try{
        const response = await AXIOS_CONFIG.get('company/')
        console.log(response.data)
        return response.data
    }catch(error){
        console.log(error)
    }
}

export default getCompanies;




export const createCompany = async (data)=>{
    await AXIOS_CONFIG.post('company/' , data).then((response)=>{
        return response
    }).catch((error)=>{
        console.log(error)
    })
}


export const getCompanyDetails = async (company_id) => {
    try{
        const response = await AXIOS_CONFIG.get(`company/${company_id}`);
        return response.data
    }catch(error){
        console.log(response)
    }
}



export const updateCompany = async (company_id , data) => {
 await AXIOS_CONFIG.patch(`companies/companyDetails/${company_id}` , data).then((response)=>{
    return response
 }).catch((error)=>{
    console.log(error)
 })
}



export const deleteCompany = async (company_id) =>{
    try{
        
    }catch(error){

    }
}