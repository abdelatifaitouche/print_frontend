import AXIOS_CONFIG from "@/config/axiosConfig";




const getOrders = async () =>{
    try{
        const response = await AXIOS_CONFIG.get('orders/');
        return response.data
    }catch(errors){

    }
}


export default getOrders




export const getOrderDetails = async (order_id) =>{
    try{
        const response = await AXIOS_CONFIG.get(`orders/${order_id}`);
        console.log(response.data)
        return response.data
    }catch(error){
        console.log(error)
    }
}



export const deleteOrder = async (order_id) =>{
    try{
        const response = await AXIOS_CONFIG.delete(`/orders/${order_id}/`);
        return response.data
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




export const getOrdersStats = async () =>{
    try{    
        
        const response = await AXIOS_CONFIG.get('orders/ordersStats') ; 
        return response
    

    }catch(error){
        console.log(error)
    }
}



export const updateOrderItem = async (order_id , data) => {
    try{
        const response = await AXIOS_CONFIG.patch(`items/${order_id}` , data)
        console.log(response)
        return response
    }catch(error){
        console.log(error)
    }
}