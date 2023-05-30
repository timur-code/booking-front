// Adjust the type definition
import IBooking from "@component/models/IBooking";
import IRestaurant from "@component/models/IRestaurant";
import React, {useState} from "react";
import Link from "next/link";
import {Button} from "react-bootstrap";
import adminApi from "@component/mixin/adminApi";
import Cookies from "js-cookie";
import mainApi from "@component/mixin/mainApi";


// Adjust the BookingCard component
interface BookingCardProps {
    booking: any;
    restaurant: IRestaurant | undefined;
}

const BookingCard: React.FC<BookingCardProps> = ({booking, restaurant}) => {
    const [canceled, setCanceled] = useState(booking.canceled);
    // handle the case where the restaurant was not found

    let totalPrice = 0;
    if (booking.bookingItems != null && booking.bookingItems.length !== 0) {
        console.log(booking.bookingItems)
        // @ts-ignore
        totalPrice = booking.bookingItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
    }

    const handleCancel = async () => {
        const res = await mainApi.cancelBooking(Cookies.get("access_token") || '', booking.id);
        if (res) {
            setCanceled(true);
        }
    }

    const cardStyle = {
        backgroundImage: 'url(/item.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    if (restaurant) {
        cardStyle.backgroundImage = restaurant.image ? `url(${restaurant.image})` : 'url(/item.jpg)'
    }

    function formatDateTime(dateTimeString: string): string {
        const date = new Date(dateTimeString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-11, so add 1 and pad to 2 digits
        const day = String(date.getDate()).padStart(2, '0');

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }


    return (
        <div>
            <div className="border-card">
                <div className="wrap-card">
                    <div
                        className="lister-card border border-success mb-2 border-opacity-25 d-flex rounded text-decoration-none"
                        style={cardStyle}
                    >
                    </div>
                    {restaurant && (<h3>{restaurant.name}</h3>)}
                    <p>Время брони: {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}</p>
                    <p>Сумма заказа: {totalPrice}</p>
                    <p>Оплачено: {booking.payed || totalPrice === 0 ? "Да" : "Нет"}</p>
                    <div>{canceled ? (<p className={"text-danger"}>Заказ отменен</p>) : (
                        <button type={"button"} className={"btn btn-outline-danger"} onClick={handleCancel}>Отменить</button>)}</div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;