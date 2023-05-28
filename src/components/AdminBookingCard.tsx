// Adjust the type definition
import IBooking from "@component/models/IBooking";
import IRestaurant from "@component/models/IRestaurant";
import React from "react";
import Link from "next/link";

interface BookingsPageProps {
    bookings: Array<IBooking & { restaurant: IRestaurant | undefined }>;
}

// Adjust the BookingCard component
interface BookingCardProps {
    booking: any;
    restaurant: IRestaurant | undefined;
}

const BookingCard: React.FC<BookingCardProps> = ({booking, restaurant}) => {
    // handle the case where the restaurant was not found

    let totalPrice = 0;
    if (booking.bookingItems != null && booking.bookingItems.length !== 0) {
        console.log(booking.bookingItems)
        // @ts-ignore
        totalPrice = booking.bookingItems.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
    }

    const cardStyle = {
        backgroundImage: 'url(/item.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    if (restaurant) {
        cardStyle.backgroundImage = restaurant.img ? `url(${restaurant.img})` : 'url(/item.jpg)'
    }

    function formatDateTime(dateTimeString: string): string {
        const date = new Date(dateTimeString);

        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Months are 0-11, so add 1 and pad to 2 digits
        const day = String(date.getUTCDate()).padStart(2, '0');

        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');

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
                </div>
            </div>
        </div>
    );
};

export default BookingCard;