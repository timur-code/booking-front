import {GetServerSideProps} from 'next';
import IBooking from "@component/models/IBooking";
import IRestaurant from "@component/models/IRestaurant";
import BookingCard from "@component/components/BookingCard";
import cookie from "cookie";

interface BookingsPageProps {
    bookings: Array<IBooking & { restaurant: IRestaurant }>;
}

export const getServerSideProps: GetServerSideProps<BookingsPageProps> = async (context) => {
    const cookies = cookie.parse(context.req.headers.cookie || '');
    const accessToken = cookies.access_token;
    const res = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + '/booking?pageNum=1&pageSize=10', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    const data = await res.json();
    const bookings: IBooking[] = data.content;

    const restaurantIds: number[] = bookings
        .map((booking) => booking.restaurant?.id)
        .filter((restaurantId): restaurantId is number => restaurantId !== null);

    const restaurantRes = await fetch(process.env.NEXT_PUBLIC_BOOKING_SERVICE + '/restaurant/list-by-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // add authentication headers here if necessary
        },
        body: JSON.stringify({ idList: restaurantIds }),
    });
    const restaurantResponse = await restaurantRes.json();
    const restaurants: IRestaurant[] = restaurantResponse.data;

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
};

const BookingsPage: React.FC<BookingsPageProps> = ({ bookings }) => {
    console.log("Res Array: ", bookings)

    return (
        <div>
            <h1 className="w-50 d-flex flex-row flex-wrap m-auto ">Bookings</h1>
            <div className="w-50 d-flex flex-row flex-wrap m-auto gap-2">
                {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} restaurant={booking.restaurant}/>
                ))}
            </div>
        </div>
    );
}

export default BookingsPage;