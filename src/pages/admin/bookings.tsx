import React from 'react';
import {GetServerSideProps} from 'next';
import checkAdmin from "@component/utils/checkAdmin";
import adminApi from "@component/mixin/adminApi";
import IBooking from "@component/models/IBooking";
import BookingCard from "@component/components/BookingCard";
import IRestaurant from "@component/models/IRestaurant";

interface AdminBookingsProps {
    bookings: Array<IBooking & { restaurant: IRestaurant }>;
}

const AdminBookingsPage: React.FC<AdminBookingsProps> = ({bookings}) => {
    return (
        <div className="w-75 m-auto">
            <p className="h1">Admin Bookings</p>
            <div className={"d-flex flex-row flex-wrap gap-3"}>
                {bookings && bookings.map((item) => (
                    <div key={item.id}>
                        <BookingCard booking={item} restaurant={undefined}/>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    //TODO: Добавить данные пользователей
    await checkAdmin(context)
    const bookings: IBooking[] = await adminApi.getAllBookings(context)
    const restaurantIds: number[] = bookings
        .map((booking) => booking.restaurant?.id)
        .filter((restaurantId): restaurantId is number => restaurantId !== null);

    const restaurants = await adminApi.getRestaurantsByIds(context, restaurantIds);

    const bookingsWithRestaurants: Array<IBooking & { restaurant: IRestaurant }> = bookings
        .map((booking) => {
            const restaurant = restaurants.find((restaurant) => restaurant.id === booking.restaurant?.id);
            return restaurant ? { ...booking, restaurant } : null;
        })
        .filter((booking): booking is IBooking & { restaurant: IRestaurant } => booking !== null);

    console.log(bookingsWithRestaurants)
    return {
        props: {
            bookings: bookingsWithRestaurants,
        },
    };
}

export default AdminBookingsPage;
