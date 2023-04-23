import {reAxios} from "../../axios";
import IRestaurant from "@component/models/IRestaurant";


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

    async getRestaurantById(id: string) {
        try {
            const response = await reAxios.get(`/restaurant/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw error.response.data;
        }
    },

    async getRestaurantMenuById(id: string) {
        try {
            const response = await reAxios.get(`/restaurant/${id}`);
            return response.data.data;
        } catch (error: any) {
            throw error.response.data;
        }
    }
};

export default mainApi;