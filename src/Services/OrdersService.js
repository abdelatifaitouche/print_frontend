import AXIOS_CONFIG from "@/config/axiosConfig";




const getOrders = async () =>{
    try{
        const response = await AXIOS_CONFIG.get('orders/ordersList/');
        return response.data
    }catch(errors){

    }
}


export default getOrders




const createOrder =  ()=>{
    try {
        //post request
    }catch(error){
        console.log(error)
    }
}
