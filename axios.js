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
    // await refreshToken(error);
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
    if (!error.contains("500")) {
        await refreshToken(error);
    }
});

const refreshToken = async (error) => {
    const refreshToken = Cookies.get('refresh_token');
    if (refreshToken) {
        try {
            // Request a new access token using the refresh token
            const response = await axios.create({
                baseURL: process.env.NEXT_PUBLIC_USER_SERVICE,
            }).post('/auth/refresh', {refreshToken: refreshToken});
            const newAccessToken = response.data.access_token;
            const newRefreshToken = response.data.refresh_token;

            Cookies.remove('access_token');
            Cookies.set('access_token', newAccessToken);
            console.log("ACCESS TOKEN ", newAccessToken)

            Cookies.remove('refresh_token');
            Cookies.set('refresh_token', newRefreshToken);
            console.log("ACCESS TOKEN ", newRefreshToken)
        } catch (refreshError) {
            // If the refresh token is also invalid, ask the user to log in again
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            Cookies.remove('me');
            // Redirect the user to the login page or show a login modal
        }
    } else {
        // If there's no refresh token, ask the user to log in again
        Cookies.remove('access_token');
        Cookies.remove('me');
        // Redirect the user to the login page or show a login modal
    }
}


export {uAxios, reAxios}
