import AXIOS_CONFIG from "@/config/axiosConfig";




const getOrders = async () =>{
    try{
        const response = await AXIOS_CONFIG.get('orders/ordersList/');
        return response.data
    }catch(errors){

    }
}


export default getOrders




export const getOrderDetails = async (order_id) =>{
    try{
        const response = await AXIOS_CONFIG.get(`orders/orderDetails/${order_id}`);
        console.log(response.data.order)
        return response.data.order
    }catch(error){
        console.log(error)
    }
}






const createOrder =  ()=>{
    try {
        //post request
    }catch(error){
        console.log(error)
    }
}
