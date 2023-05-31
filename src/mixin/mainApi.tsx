import {reAxios} from "../../axios";
import IMenu from "@component/models/IMenu";
import IBooking from "@component/models/IBooking";
import ICartItem from "@component/models/ICartItem";


const mainApi = {
    async listRestaurant(pageNum: number) {

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE}/restaurant/list?page=${pageNum}&size=6`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },

            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const res = await response.json();
            return res;
        } catch (error: any) {
            throw error;
        }
    },

    async getRestaurantById(id: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE}/restaurant/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },

            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const res = await response.json();
            return res.data;
        } catch (error: any) {
            throw error.response.data;
        }
    },

    async getRestaurantMenuById(id: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE}/restaurant/${id}/menu`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const res = await response.json();
            return res.data;
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
            return response.data.data.stripeUrl;
        } catch (error: any) {
            throw error.response;
        }
    },

    async createBookingNoPreorder(booking: IBooking) {
        try {
            const response = await reAxios.post(`/booking`, booking);
            return response.data;
        } catch (error: any) {
            throw error.response;
        }
    },

    async createSupportRequest(request: {phone: string, text:string}) {
        try {
            const response = await reAxios.post(`/support`, request);
            return response.data
        } catch (error: any) {
            throw error;
        }
    },

    async cancelBooking(accessToken: string, id: number) {
        const res = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/booking/${id}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });
        return res.ok;
    },
};

export default mainApi;