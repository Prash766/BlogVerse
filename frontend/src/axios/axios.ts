import axios from "axios";

export const axiosClient = axios.create({
    baseURL:"http://localhost:8787/api/v1",
    withCredentials:true
})