import AXIOS_CONFIG from "@/config/axiosConfig";




export const getOrders = async (params = {}) => {
  try {
    const { page = 1, status, company_id } = params;
    
    // Build query string
    let queryString = `page=${page}`;
    if (status && status !== 'all') {
      queryString += `&status=${status}`;
    }
    if (company_id) {
      queryString += `&company_id=${company_id}`;
    }
    
    const response = await AXIOS_CONFIG.get(`orders?${queryString}`);
    
    // Response structure: [data, pagination]
    // pagination: { page, total_pages, total_items }
    return response.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};


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

export const acceptOrder = async (order_id) =>{
    try{
        const response = await AXIOS_CONFIG.patch(`/orders/${order_id}/accept/`);
        return response.data
    }catch(error){
        console.log(error)
    }
}

export const rejectOrder = async (order_id) =>{
    try{
        const response = await AXIOS_CONFIG.patch(`/orders/${order_id}/reject/`);
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



export const nextStageOrderItem = async (item_id) => {
  try {
    const response = await AXIOS_CONFIG.patch(
      `items/${item_id}/next_stage/`
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};