import React from 'react';
import {GetServerSideProps} from 'next';
import checkAdmin from "@component/utils/checkAdmin";
import adminApi from "@component/mixin/adminApi";
import IBooking from "@component/models/IBooking";
import IRestaurant from "@component/models/IRestaurant";
import IUser from "@component/models/IUser";
import BookingAdminCard from "@component/components/BookingAdminCard";
import {Table} from "react-bootstrap";

interface AdminBookingsProps {
    bookings: Array<IBooking & { restaurant: IRestaurant, user: IUser }>;
}

const AdminBookingsPage: React.FC<AdminBookingsProps> = ({bookings}) => {

    return (
        <div className="w-75 m-auto">
            <p className="h1">Все брони</p>
            <Table striped bordered hover variant="dark">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Ресторан</th>
                    <th>Время начала</th>
                    <th>Время до</th>
                    <th>С предзаказом</th>
                    <th>Сумма</th>
                    <th>Имя</th>
                    <th>Номер</th>
                    <th>Отмена</th>
                </tr>
                </thead>
                <tbody>
                {bookings && bookings.map((item) => (
                    <BookingAdminCard key={item.id} booking={item} restaurant={item.restaurant} user={item.user}/>
                ))}
                </tbody>
            </Table>
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    await checkAdmin(context)
    const bookings: IBooking[] = await adminApi.getAllBookings(context)
    const restaurantIds: number[] = bookings
        .map((booking) => booking.restaurant?.id)
        .filter((restaurantId): restaurantId is number => restaurantId !== null);
    const userIds: string[] = bookings
        .map((booking) => booking.userId)
        .filter((userId): userId is string => userId !== null);

    const restaurants = await adminApi.getRestaurantsByIds(context, restaurantIds);

    const bookingsWithRestaurants: Array<IBooking & { restaurant: IRestaurant }> = bookings
        .map((booking) => {
            const restaurant = restaurants.find((restaurant) => restaurant.id === booking.restaurant?.id);
            return restaurant ? {...booking, restaurant} : null;
        })
        .filter((booking): booking is IBooking & { restaurant: IRestaurant } => booking !== null);

    const users = await adminApi.getUsersById(context, userIds);
    const resBookings: Array<IBooking & { restaurant: IRestaurant, user: IUser }> = bookingsWithRestaurants
        .map((booking) => {
            const user = users.find((user) => user.id === booking.userId);
            return user ? {...booking, user} : null;
        })
        .filter((booking): booking is IBooking & { restaurant: IRestaurant, user: IUser } => booking !== null);

    console.log(resBookings)
    return {
        props: {
            bookings: resBookings,
        },
    };
}

export default AdminBookingsPage;
