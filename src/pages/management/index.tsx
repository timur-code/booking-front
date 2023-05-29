import React from 'react';
import {GetServerSideProps} from 'next';
import adminApi from "@component/mixin/adminApi";
import IRestaurant from "@component/models/IRestaurant";
import IBooking from "@component/models/IBooking";
import IUser from "@component/models/IUser";
import {Table} from "react-bootstrap";
import BookingAdminCard from "@component/components/BookingAdminCard";
import Link from "next/link";

interface ManagementPageProps {
    restaurant: IRestaurant,
    bookings: Array<IBooking & { user: IUser }>;
}

const ManagementPage: React.FC<ManagementPageProps> = ({restaurant, bookings}) => {
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
                    <BookingAdminCard key={item.id} booking={item} restaurant={restaurant} user={item.user}/>
                ))}
                </tbody>
            </Table>

            <Link type={"button"} className={"btn btn-outline-info"} href={'/management/menu'}>Добавить блюдо в меню</Link>
        </div>
    );
};


export const getServerSideProps: GetServerSideProps = async (context) => {
    let res
    try {
        res = await adminApi.getMyRes(context);
    } catch (ex: any) {
        if (context.res) {
            context.res.writeHead(302, {Location: '/management/login'});
            context.res.end();
        }
    }
    if (!res) {
        if (context.res) {
            context.res.writeHead(302, {Location: '/management/login'});
            context.res.end();
        }
    }

    try {
        const bookings: IBooking[] = await adminApi.getAllBookingsByRes(res.id, context)
        const userIds: string[] = bookings
            .map((booking) => booking.userId)
            .filter((userId): userId is string => userId !== null);


        const users = await adminApi.getUsersById(context, userIds);
        const bookingsWithUsers: Array<IBooking & { user: IUser }> = bookings
            .map((booking) => {
                const user = users.find((user) => user.id === booking.userId);
                return user ? {...booking, user} : null;
            })
            .filter((booking): booking is IBooking & { user: IUser } => booking !== null);

        return {
            props: {
                restaurant: res,
                bookings: bookingsWithUsers
            },
        };
    } catch (ex: any) {
        if (context.res) {
            context.res.writeHead(302, {Location: '/management'});
            context.res.end();
        }
    }
    return {
        props: {
        },
    };
};

export default ManagementPage;
