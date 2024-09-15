import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { isAuthenticated, userInfo } from '@/atoms/user';
import { axiosClient } from '@/axios/axios';

const ProtectedRoutes = () => {
  const [isAuth , setIsAuth ]= useRecoilState(isAuthenticated);
  const setUserDetails = useSetRecoilState(userInfo)

  useEffect(()=>{
    const verify = async()=>{
        const res = await axiosClient.get('/user/verify')
        if(res.status===200){
          setUserDetails(res.data.user)
            setIsAuth(true)
        }
        else{
            setIsAuth(false)
        }
    }
    verify()


  },[setIsAuth])


  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(isAuth));
  }, [isAuth]);


  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
