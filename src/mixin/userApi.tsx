import {uAxios} from "../../axios";
import IUser from "@component/models/IUser";
import Router from "next/router";
import Cookies from 'js-cookie';


const userApi = {
    async login(phone: string, password: string) {
        try {
            const response = await uAxios.post('/auth/login', {phone, password});
            const res = response.data;

            const token = res.data.access_token;
            const refreshToken = res.data.refresh_token;

            // Save the token in localStorage or use another storage method
            Cookies.set('access_token', token);
            Cookies.set('refresh_token', refreshToken);

            const user: IUser = await this.getCurrentUser();
            Cookies.set('me', JSON.stringify(user));
            Router.reload();
        } catch (error: any) {
            throw error.response.data;
        }
    },

    async register(phone: string, password: string, firstName: string, lastName: string) {
        try {
            const response = await uAxios.post('/auth/register', {phone, password, firstName, lastName});
            const res = response.data;
            console.log("success: ", res);
            return res;
        } catch (error: any) {
            throw error;
        }
    },


    async logout() {
        try {
            // await uAxios.post('/auth/logout');
            // Remove the token from localStorage or another storage method
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            Cookies.remove('me');
            await Router.push("/");
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
            const userInfo: IUser = response.data as IUser;
            console.log("User Info: ", userInfo);
            return userInfo;
        } catch (error: any) {
            throw error.response.data;
        }
    },
};

export default userApi;