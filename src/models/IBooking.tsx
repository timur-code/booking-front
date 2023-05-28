import ICartItem from "@component/models/ICartItem";
import IRestaurant from "@component/models/IRestaurant";

interface IBooking {
    restaurant: IRestaurant | null;
    id: number | null,
    userId: string,
    restaurantId: number | null,
    timeStart: string, // You can set an initial value if needed
    timeEnd: string, // You can set an initial value if needed
    guests:number,
    stripeSessionId: string | null,
    stripeUrl: string | null,
    preorder: Array<ICartItem>
}

export default IBooking;