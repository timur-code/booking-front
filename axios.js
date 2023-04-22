import axios from 'axios';

const uAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_USER_SERVICE,
});

// Request interceptor to add Authorization token to all requests, if available
uAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    async (error) => {
        if (error.response.status === 401 && error.response.data.error === "invalid_token") {
            // Check if there is a refresh token available
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    // Request a new access token using the refresh token
                    const response = await axios.post('/auth/refresh', {refresh_token: refreshToken});
                    const newAccessToken = response.data.access_token;

                    // Update the token in axios instance and localStorage
                    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    localStorage.setItem('access_token', newAccessToken);

                    // Retry the original request with the new token
                    const originalRequest = error.config;
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
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
        return Promise.reject(error);
    }
);

export default uAxios;