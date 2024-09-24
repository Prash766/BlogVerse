import axios from "axios";

export const axiosClient = axios.create({
    baseURL:"https://backend.prash2339.workers.dev/api/v1",
    withCredentials:true
})