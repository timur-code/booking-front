import ICartItem from "@component/models/ICartItem";
import {ZonedDateTime} from "@internationalized/date";

interface IBooking {
    id: number | null,
    restaurantId: number | null,
    timeStart: string, // You can set an initial value if needed
    timeEnd: string, // You can set an initial value if needed
    guests:number,
    stripeSessionId: string | null,
    stripeUrl: string | null,
    preorder: Array<ICartItem>
}

export default IBooking;