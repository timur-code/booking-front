import IRestaurant from "@component/models/IRestaurant";
import React, {useState} from "react";
import IUser from "@component/models/IUser";
import {Button} from "react-bootstrap";
import adminApi from "@component/mixin/adminApi";
import Cookies from "js-cookie";

interface BookingCardProps {
    booking: any;
    restaurant: IRestaurant | undefined;
    user: IUser;
}

const BookingCard: React.FC<BookingCardProps> = ({booking, restaurant, user}) => {
    const [canceled, setCanceled] = useState(booking.canceled);

    let totalPrice = 0;
    if (booking.bookingItems != null && booking.bookingItems.length !== 0) {
        console.log(booking.bookingItems)
        // @ts-ignore
        totalPrice = booking.bookingItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
    }

    const handleCancel = async () => {
        const res = await adminApi.cancelBookingAdmin(Cookies.get("access_token") || '', booking.id);
        if (res) {
            setCanceled(true);
        }
    }

    function formatDateTime(dateTimeString: string): string {
        const date = new Date(dateTimeString);

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    return (
        <tr>
            <td>{booking.id}</td>
            <td>{restaurant ? restaurant?.name : ''}</td>
            <td>{formatDateTime(booking.startTime)}</td>
            <td>{formatDateTime(booking.endTime)}</td>
            <td>{totalPrice > 0 ? 'Да' : 'Нет'}</td>
            <td>{totalPrice}</td>
            <td>{user.lastName + ' ' + user.firstName}</td>
            <td>{user.phone}</td>
            <td>{canceled ? (<p className={"text-danger"}>Заказ отменен</p>) : (
                <Button type={"button"} onClick={handleCancel}>Отменить</Button>)}</td>
        </tr>
    );
};

export default BookingCard;