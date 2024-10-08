import { atom } from "recoil";

export const userInfo = atom<any>({
  key: "UserInfoAtom",
  default: {},
});



const getInitialAuthState = (): boolean => {
    const storedAuth = localStorage.getItem('authState');
    return storedAuth ? JSON.parse(storedAuth) : false;
  };
  
  export const isAuthenticated = atom<boolean>({
    key: 'authAtom',
    default: getInitialAuthState(), 
  });