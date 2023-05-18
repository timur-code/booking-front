import axios from 'axios';
import Cookies from "js-cookie";

const reAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BOOKING_SERVICE,
});

reAxios.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

reAxios.interceptors.response.use(undefined, async (error) => {
    //TODO: поменять чтобы отрабатывал на 401 только
    console.log(`AXIOS ERROR: ${error}`)
    // Check if there is a refresh token available
    await refreshToken(error);
});

const uAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_USER_SERVICE,
});

uAxios.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

uAxios.interceptors.response.use(undefined, async error => {
    //TODO: поменять чтобы отрабатывал на 401 только
    console.log(`AXIOS ERROR: ${error}`)
    // Check if there is a refresh token available
    await refreshToken(error);
});

const refreshToken = async (error) => {
    const refreshToken = Cookies.get('refresh_token');
    if (refreshToken) {
        try {
            // Request a new access token using the refresh token
            const response = await axios.create({
                baseURL: process.env.NEXT_PUBLIC_USER_SERVICE,
            }).post('/api/auth/refresh', {refresh_token: refreshToken});
            const newAccessToken = response.data.access_token;

            // Update the token in axios instance and localStorage
            Cookies.set('access_token', newAccessToken);

            // Update the token in the Axios instance
            uAxios.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
            reAxios.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;

            // Retry the original request with the new token
            const originalRequest = error.config;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return error.config.baseURL === process.env.NEXT_PUBLIC_BOOKING_SERVICE
                ? reAxios.request(originalRequest)
                : uAxios.request(originalRequest);
        } catch (refreshError) {
            // If the refresh token is also invalid, ask the user to log in again
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            // Redirect the user to the login page or show a login modal
        }
    } else {
        // If there's no refresh token, ask the user to log in again
        localStorage.removeItem('access_token');
        // Redirect the user to the login page or show a login modal
    }
}


export {uAxios, reAxios}
