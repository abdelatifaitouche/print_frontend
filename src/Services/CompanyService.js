import AXIOS_CONFIG from "@/config/axiosConfig";




const getCompanies = async () =>{
    try{
        const response = await AXIOS_CONFIG.get('companies/companiesList/')
        return response.data
    }catch(error){
        console.log(error)
    }
}

export default getCompanies;




export const createCompany = async (data)=>{
    await AXIOS_CONFIG.post('companies/companiesList/' , data).then((response)=>{
        return response
    }).catch((error)=>{
        console.log(error)
    })
}


export const getCompanyDetails = async (company_id) => {
    try{
        const response = await AXIOS_CONFIG.get(`companies/companyDetails/${company_id}`);
        return response.data.response
    }catch(error){
        console.log(response)
    }
}
