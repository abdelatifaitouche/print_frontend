const ENV = 'developement' ; 


//dev : "http://127.0.0.1:8000/api/"

// prod : https://print-backend-z4p1.onrender.com/api/v1/
let BASE_API_URL = ""

const config = {
    developement : {
        API_URL : "https://print-backend-z4p1.onrender.com/api/v1/"
    },
}

/*
const BASE_API_URL = import.meta.env.VITE_API_URL;
export default BASE_API_URL;

*/

export default BASE_API_URL = config[ENV].API_URL;