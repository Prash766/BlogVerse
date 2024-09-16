import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { isAuthenticated, userInfo } from '@/atoms/user';
import { axiosClient } from '@/axios/axios';

const ProtectedRoutes = () => {
  const [isAuth, setIsAuth] = useRecoilState(isAuthenticated);
  const setUserDetails = useSetRecoilState(userInfo);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axiosClient.get('/user/verify');
        if (res.status === 200 && res.data.success) {
          setUserDetails(res.data.user);
          setIsAuth(true);
        } else {
          setIsAuth(false);
          localStorage.removeItem('authState'); 
        }
      } catch (error) {
        setIsAuth(false);
        localStorage.removeItem('authState'); 
      }
    };

    verify();
  }, [setIsAuth, setUserDetails]);

  useEffect(() => {
    localStorage.setItem('authState', JSON.stringify(isAuth));
  }, [isAuth]);

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
