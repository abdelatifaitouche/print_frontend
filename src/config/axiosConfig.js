import axios from 'axios';
import BASE_API_URL from './apiConfig'




const AXIOS_CONFIG =  axios.create({
    baseURL : BASE_API_URL ,
    withCredentials : true , 
    headers: {
      "Content-Type": "application/json",
    },
  })



export default  AXIOS_CONFIG ;