import React, {useState} from 'react';
import CartItem from '@component/components/CartItem';
import mainApi from "@component/mixin/mainApi";
import IMenuItem from "@component/models/IMenuItem";
import {GetServerSideProps} from "next";
import cookie from "cookie";
import cart from "@component/store/cart";
import { Toast } from 'react-bootstrap';
import IBooking from "@component/models/IBooking";
import {getLocalTimeZone, now} from "@internationalized/date";
import TimePicker from "@component/input/timepicker";

const CartPage: React.FC<{ initialCartItems: Array<IMenuItem> }> = ({initialCartItems}) => {

    const [cartItems, setCartItems] = React.useState(initialCartItems);
    const [showToast, setShowToast] = React.useState(false);
    const [booking, setBooking] = useState<IBooking>({
        id: null,
        restaurantId: cart.getRestaurantId(),
        timeStart: now(getLocalTimeZone()).toString(), // You can set an initial value if needed
        timeEnd: now(getLocalTimeZone()).toString(),
        guests: 1,
        preorder: cart.getCartItems(),
        stripeSessionId: null,
        stripeUrl: null
    });

    console.log("booking ", booking)

    const handleRemove = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        cart.removeFromCart(id)
        setShowToast(true);
    };

    const handleBooking = () => {
        setBooking((prevState) => {
            return {
                ...prevState,
                timeStart: prevState.timeStart,
                timeEnd: prevState.timeEnd
            }
        });
        mainApi.createBooking(booking).then(r => {
            window.location.href = r
        });
    }

    const handleTimeChange = (date: string, time: string) => {
        setBooking((prevState) => {
            return {
                ...prevState,
                timeStart: `${date}T${time}:00Z`,
            };
        });
    };

    const handleTimeEndChange = (date: string, time: string) => {
        setBooking((prevState) => {
            return {
                ...prevState,
                timeEnd: `${date}T${time}:00Z`,
            };
        });
    };



    return (
        <div>
            <div className="cart-name wow zoomIn">
                <h1>Cart</h1>
            </div>
            <div className="d-flex justify-content-center pt-5">
                <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                quantity={1}
                                onRemove={() => handleRemove(item.id)}
                            />
                        ))
                    ) : (
                        <p>No items in cart</p>
                    )}
                </div>
            </div>
            <div>
                <TimePicker
                    label="Выберете время начала брони"
                    time={booking.timeStart}
                    onTimeChange={(date, time) => handleTimeChange(date, time)}
                />
                <TimePicker
                    label="Выберете время окончания брони"
                    time={booking.timeEnd}
                    onTimeChange={(date, time) => handleTimeEndChange(date, time)}
                />
                <div className="m-auto w-25 d-flex justify-content-center">
                    <button className="cafe-button" type='submit' onClick={handleBooking}>Бронировать</button>
                </div>
            </div>
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={1000}
                autohide
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    minWidth: 200,
                }}
            >
                <Toast.Header>
                    <strong className="mr-auto">Cart Notification</strong>
                </Toast.Header>
                <Toast.Body className="text-black">Item removed from cart!</Toast.Body>
            </Toast>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    let initialCartItems = new Array<IMenuItem>;

    const cookies = cookie.parse(context.req.headers.cookie || '');

    try {
        initialCartItems = await mainApi.getCartItems(JSON.parse(cookies.cart).items, cookies.access_token);
    } catch (error) {
        console.error('Failed to fetch cart items:', error);
    }

    return {
        props: {
            initialCartItems,
        }
    }
}

export default CartPage;
