import AXIOS_CONFIG from "@/config/axiosConfig";
import { createContext, useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    await AXIOS_CONFIG.post("auth/login/", {
      email: e.target.email.value,
      password: e.target.password.value,
    })
      .then((response) => {
        setIsLoading(false);
        setIsAuthenticated(true);
        navigate("/");
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setIsAuthenticated(false);
        setIsLoading(false);
        if (error.response?.status === 401 || error.response?.status === 400) {
          toast("Wrong Credentials!", {
            description: "Invalid email or password.",
            icon: "❌",
          });
        } else {
          toast("Something went wrong !!!");
        }
      });
  };

  let verifyToken = async () => {
    try {
      const response = await AXIOS_CONFIG.post("auth/verify/");
      if (response.status === 200) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.error("Token verification failed:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated !== false) {
      verifyToken();
    }
  }, []);

  let logout = async () => {
    //send a request to api/auth/logout
    await AXIOS_CONFIG.post("auth/logout/" , null).then((response)=>{
        if (response.status === 200){
            setIsAuthenticated(false)
            setTimeout(() => {
                window.location.href = "auth/login"; // Hard refresh ensures cookies are cleared
            }, 500);  // Wait 500ms before redirecting
        
        }
    })
}

  let contextData = {
    login: login,
    isLoading: isLoading,
    isAuthenticated: isAuthenticated,
    logout : logout
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
