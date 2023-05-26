import {reAxios} from "../../axios";
import IRestaurant from "@component/models/IRestaurant";
import IMenu from "@component/models/IMenu";
import IBooking from "@component/models/IBooking";
import ICartItem from "@component/models/ICartItem";


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
            throw error;
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

    async getItemById(id: number, accessToken: string) {
        console.log(`access ${accessToken}`)
        const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/menu/item/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include the access token in the headers if required
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (!response.ok) {
            console.error(`Response status was not OK: ${response.status}`);
            return;
        }
        const item = await response.json();
        return item;
    },

    async getCartItems(items: Array<ICartItem>, accessToken: string) {
        try {
            const itemPromises = items.map(item => this.getItemById(item.itemId, accessToken));
            const list = await Promise.all(itemPromises);
            return list;
        } catch (error: any) {
            throw error;
        }
    },


    async createBooking(booking: IBooking) {
        try {
            const response = await reAxios.post(`/booking`, booking);
            console.log("response temp booking: ", response.data)
            return response.data.data.stripeUrl
        } catch (error: any) {
            throw error.response;
        }
    },

    async confirmBooking(id: number | null) {
        if (!id) {
            return
        }
        try {
            const response = await reAxios.post(`/booking/${id}/confirm`);
            console.log("response confirm booking: ", response.data)
        } catch (error: any) {
            throw error.response.data;
        }
    }
};

export default mainApi;