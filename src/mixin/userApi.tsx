import uAxios from "../../axios";
import IUser from "@component/models/IUser";
import Router from "next/router";


const userApi = {
    async login(phone:string, password:string) {
        try {
            const response = await uAxios.post('/auth/login', {phone, password});
            const res = response.data;

            const token = res.data.access_token;
            const refreshToken = res.data.refresh_token;

            // Save the token in localStorage or use another storage method
            localStorage.setItem('access_token', token);
            localStorage.setItem('refresh_token', refreshToken);

            const user:IUser = await this.getCurrentUser();
            localStorage.setItem('me', JSON.stringify(user));
            Router.reload();
        } catch (error: any) {
            throw error.response.data;
        }
    },

    async logout() {
        try {
            await uAxios.post('/auth/logout');
            // Remove the token from localStorage or another storage method
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('me');
            Router.reload();
        } catch (error: any) {
            throw error.response.data;
        }
    },

    // async register(userData) {
    //   try {
    //     const response = await uAxios.post('/auth/register', userData);
    //     return response.data;
    //   } catch (error) {
    //     throw error.response.data;
    //   }
    // },

    async getCurrentUser() {
        try {
            const response = await uAxios.get('/auth/me');
            const userInfo:IUser = response.data as IUser;
            console.log("User Info: ", userInfo);
            return userInfo;
        } catch (error: any) {
            throw error.response.data;
        }
    },
};

export default userApi;