import apiClient from "./apiClient"

const saveAccessToken = (token) => {
    localStorage.setItem('access_token', token)
}
// const saveRefreshToken = (token) => {
//     document.cookie = `refresh_token=${token}; path=/; HttpOnly;`
// }

const saveRefreshToken = (token) => {
    localStorage.setItem('refresh_token', token) // Сохраняем в localStorage
}

export const loginUser = async (data)=>{
    try {
        const response = await apiClient.post('/auth/token', {...data,})
        const {access_token, refresh_token} = response.data
        saveAccessToken(access_token)
        saveRefreshToken(refresh_token)
        return response.data
    }
    catch (error){
        console.error('Ошибка',error)
        throw error
    }
}

// export const refreshAccessToken = async ()=>{
//     try {
//         const response = await apiClient.post('auth/refresh',{}, {
//             withCredentials: true
//         })
//         const {access_token} = response.data
//         localStorage.setItem('access_token', access_token)
//         return access_token
//     }
//     catch (error){
//         console.error('Ошибка при обновлении токена', error)
//         throw error
//     }
// }
export const refreshAccessToken = async () => {
    try {
        const refreshToken = localStorage.getItem('refresh_token'); // Получаем refresh
        if (!refreshToken) throw new Error("Refresh token отсутствует!");

        const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken });

        const { access_token, refresh_token: newRefreshToken } = response.data;
        
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', newRefreshToken);

        return access_token;
    } catch (error) {
        console.error('Ошибка при обновлении токена', error);
        throw error;
    }
};