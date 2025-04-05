import AXIOS_CONFIG from "@/config/axiosConfig";
import { createContext, useState } from "react";
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

  let contextData = {
    login: login,
    isLoading: isLoading,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
