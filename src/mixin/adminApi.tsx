import IUser from "@component/models/IUser";
import Router from "next/router";
import Cookies from 'js-cookie';
import ICreateMenu from "@component/models/ICreateMenu";
import ICreateMenuItem from "@component/models/ICreateMenuItem";
import ICreateRestaurant from "@component/models/ICreateRestaurant";
import {GetServerSidePropsContext} from "next";
import cookie from "cookie";
import ISupportRequest from "@component/models/ISupportRequest";
import IBooking from "@component/models/IBooking";
import IRestaurant from "@component/models/IRestaurant";

const adminApi = {
    async login(phone: string, password: string) {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_USER_SERVICE + '/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({phone, password}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }


            const res = await response.json();
            const token = res.data.access_token;
            const refreshToken = res.data.refresh_token;


            Cookies.set('access_token', token);
            Cookies.set('refresh_token', refreshToken);

            const user: IUser = await this.getCurrentUser();
            Cookies.set('me', JSON.stringify(user), {expires: 1});
            Router.reload();
        } catch (error: any) {
            throw error;
        }
    },


    async logout() {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_USER_SERVICE + '/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }


            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            Cookies.remove('me');
            Router.reload();
        } catch (error: any) {
            throw error;
        }
    },


    async isAdmin(accessToken: string) {
        try {
            console.log("Access: ", accessToken)
            const response = await fetch(process.env.NEXT_PUBLIC_USER_SERVICE + '/auth/is-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                console.log("response: ", response)
                return false;
            }

            return true;
        } catch (error: any) {
            throw error;
        }
    },

    async getMyRes(context: GetServerSidePropsContext) {
        try {
            const cookies = cookie.parse(context.req.headers.cookie || '');
            const accessToken = cookies.access_token;
            const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/restaurant/my-restaurant`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            if (!response.ok) {
                console.log("response: ", response)
                throw new Error();
            }

            return await response.json();
        } catch (error: any) {
            throw error;
        }
    },

    async getCurrentUser() {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_USER_SERVICE + '/auth/me', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',

                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const userInfo: IUser = await response.json();
            console.log("User Info: ", userInfo);
            return userInfo;
        } catch (error: any) {
            throw error;
        }
    },

    async getSupportRequests(context: GetServerSidePropsContext) {
        try {
            const cookies = cookie.parse(context.req.headers.cookie || '');
            const accessToken = cookies.access_token;
            const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + '/support', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const res = await response.json();
            const requests: ISupportRequest[] = res.content;
            return requests;
        } catch (error: any) {
            throw error;
        }
    },

    async getAllBookings(context: GetServerSidePropsContext) {
        try {
            const cookies = cookie.parse(context.req.headers.cookie || '');
            const accessToken = cookies.access_token;
            const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + '/booking/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const res = await response.json();
            const requests: IBooking[] = res.content;
            return requests;
        } catch (error: any) {
            throw error;
        }
    },

    async getAllBookingsByRes(restaurantId: string, context: GetServerSidePropsContext) {
        try {
            const cookies = cookie.parse(context.req.headers.cookie || '');
            const accessToken = cookies.access_token;
            const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/booking/by-restaurant?restaurantId=${restaurantId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const res = await response.json();
            const requests: IBooking[] = res.content;
            return requests;
        } catch (error: any) {
            throw error;
        }
    },

    async getRestaurantsByIds(context: GetServerSidePropsContext, restaurantIds: number[]) {
        const restaurantRes = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + '/restaurant/list-by-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({ idList: restaurantIds }),
        });
        const restaurantResponse = await restaurantRes.json();
        const restaurants: IRestaurant[] = restaurantResponse.data;
        return restaurants
    },

    async cancelBookingAdmin(accessToken: string, id: number) {
        const res = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/booking/${id}/cancel/admin`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        });
        return res.ok;
    },

    async getUsersById(context: GetServerSidePropsContext, id: string[]) {
        try {
            const cookies = cookie.parse(context.req.headers.cookie || '');
            const accessToken = cookies.access_token;
            const response = await fetch(process.env.NEXT_PUBLIC_USER_SERVICE + `/auth/info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ idList: id }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const user: IUser[] = await response.json();
            return user;
        } catch (error: any) {
            throw error;
        }
    },

    async resolveRequest(id: number) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE}/support/${id}/resolve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            const res = await response.json();
            const resStatus = res.status;
            return resStatus;
        } catch (error: any) {
            throw error;
        }
    },

    async createRes(restaurant: ICreateRestaurant) {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + '/restaurant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
                body: JSON.stringify(restaurant)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData.error));
            }
        } catch
            (error: any) {
            throw error;
        }
    },

    async createMenu(menu: ICreateMenu) {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/restaurant/${menu.restaurantId}/menu`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
                body: JSON.stringify(menu)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
        } catch
            (error: any) {
            throw error;
        }
    },

    async createMenuItem(item: ICreateMenuItem) {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + `/menu/item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                    'Authorization': `Bearer ${Cookies.get('access_token')}`,
                },
                body: JSON.stringify(item)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }
        } catch
            (error: any) {
            throw error;
        }
    }

}

export default adminApi;