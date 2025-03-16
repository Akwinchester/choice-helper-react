import axios from "axios";
import { refreshAccessToken } from "./login";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    
  },
});

apiClient.interceptors.request.use((config) =>{
    const token = localStorage.getItem('access_token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

apiClient.interceptors.response.use((response) => {
    return response
},
    async (error) => {
        const originRequest = error.config

        if(error.response.status === 401 && !originRequest._retry) {
            originRequest._retry = true;
        try {
            const refreshResponse = await refreshAccessToken()
            //const newAccessToken = refreshResponse.data.access_token

            localStorage.setItem('access_token', refreshResponse)

            //api.defaults.headers.common['Authorization'] = `Bearer ${refreshResponse}`;
            originRequest.headers.Authorization = `Bearer ${refreshResponse}`;

            return apiClient(originRequest);
        }
            catch (refreshError){
                console.error('error',refreshError)
                throw refreshError
            }

        }}
)


export default apiClient;