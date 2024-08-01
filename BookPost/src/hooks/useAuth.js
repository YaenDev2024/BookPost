import React ,{useEffect, useState}from 'react'
import { auth } from '../../config';
import { onAuthStateChanged } from '@firebase/auth';


export const useAuth = () => {
    const [user,setUser] = useState();


    useEffect(() => {
      const unsuscriberFromAutStatusChanged = onAuthStateChanged(auth, (user) =>{
        if(user){
            setUser(user);
        }else{  
            setUser(undefined);
        }
      })
      return unsuscriberFromAutStatusChanged
    }, [])
    
  return {
    user,
}
}
