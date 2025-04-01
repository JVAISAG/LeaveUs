"use client" 
import { useAuth } from '@/app/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const Protected = ({ children, requiredRole }) => {
 const {role ,isAuthenticated} = useAuth()
 console.log(role)
 const router = useRouter()
 useEffect(()=>{
    try{
       
        if(!isAuthenticated()){
            router.push('/login')
        }else if(requiredRole && role != requiredRole){
            router.push('/login')
        }
    }catch(error){
        console.error('Protected : ',error)
    }
 },[isAuthenticated,role,router])

return isAuthenticated() ? children : null
};


