import {reAxios} from "../../axios";
import IRestaurant from "@component/models/IRestaurant";
import IMenu from "@component/models/IMenu";
import IBooking from "@component/models/IBooking";


const mainApi = {
    async listRestaurant() {
        try {
            const response = await reAxios.get('/restaurant/list');
            const fetchedRestaurants: IRestaurant[] = response.data.content.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
                img: item.img
            }));
            return fetchedRestaurants;
        } catch (error: any) {
            throw error.response.data;
        }
    },

    async getRestaurantById(id: number) {
        try {
            const response = await reAxios.get(`/restaurant/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw error.response.data;
        }
    },

    async getRestaurantMenuById(id: number) {
        try {
            const response = await reAxios.get(`/restaurant/${id}/menu`);
            console.log("response menu: ", response.data.data)
            return response.data.data as IMenu;
        } catch (error: any) {
            throw error.response.data;
        }
    },

    async createTempBooking(booking: IBooking) {
        try {
            const response = await reAxios.post(`/booking`, booking);
            console.log("response temp booking: ", response.data)
        } catch (error: any) {
            throw error.response.data;
        }
    }
};

export default mainApi;