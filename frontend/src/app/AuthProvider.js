"use client"
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role,setRole] = useState(null)
  const [token, setToken] = useState(null);
  const router = useRouter();

    useEffect(()=>{
      const storedToken = localStorage.getItem('token')
        setToken(storedToken)
    },[token])



    useEffect(() => {
      if (!token) return;
  
      try {
        const decodedToken = jwtDecode(token);
        
        if (decodedToken && !isTokenExpired(decodedToken)) {
          setUser(decodedToken.userId);
          setRole(decodedToken.role);
          
          // Set up axios interceptor
          const axiosIntercept = axios.interceptors.request.use((config) => {
            config.headers["Authorization"] = `Bearer ${token}`;
            return config;
          });
  
          return () => {
            axios.interceptors.request.eject(axiosIntercept);
          };
        } else {
          logout();
        }
      } catch (error) {
        console.error("Token Decoding error", error);
        logout();
      }
    }, [token]);
  const login = async (values) => {
try{
    const email = values.email;
    const password = values.password;
    const response = await axios.post(
      "http://localhost:5000/login",
      JSON.stringify({
        email: email,
        password: password,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    
      const Rectoken = response.data.token;
      const decodedToken = jwtDecode(Rectoken);
      localStorage.setItem("token", Rectoken);
      setToken(Rectoken);
      const role = decodedToken.role;
    //   console.log(typeof Rectoken);
      router.push(`${role}-dashboard`);
    

}
catch(error){
    console.error('Login Error : ',error)
}   
};

const logout = ()=>{
localStorage.removeItem('token')
setToken(null)
setUser(null)
router.push('/')
}

const isAuthenticated = ()=>{
    return !!token && !!user && !isTokenExpired(user);
}

const value = {
    user,
    token,
    role,
    login,
    logout,
    isAuthenticated
}

return(
    <AuthContext.Provider value = {value}>
        {children}
    </AuthContext.Provider>
)
};

const isTokenExpired = (decodedToken)=>{
    return decodedToken.exp * 1000 < Date.now();
}

export const useAuth = ()=>{const context = useContext(AuthContext)
    if(context === 'undefined'){
        return context
    }
    return context
}