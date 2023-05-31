import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import CartItem from '@component/components/CartItem';
import mainApi from "@component/mixin/mainApi";
import IMenuItem from "@component/models/IMenuItem";
import {GetServerSideProps} from "next";
import cookie from "cookie";
import cart from "@component/store/cart";
import {Form, Toast} from 'react-bootstrap';
import IBooking from "@component/models/IBooking";
import {getLocalTimeZone, now} from "@internationalized/date";
import TimePicker from "@component/input/timepicker";
import IRestaurant from "@component/models/IRestaurant";

const CartPage: React.FC<{ initialCartItems: Array<IMenuItem> }> = ({initialCartItems}) => {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [booking, setBooking] = useState<IBooking>({
        id: null,
        restaurant: null,
        userId: '',
        restaurantId: cart.getRestaurantId(),
        timeStart: now(getLocalTimeZone()).toString(),
        timeEnd: now(getLocalTimeZone()).toString(),
        guests: 1,
        preorder: cart.getCartItems(),
        stripeSessionId: null,
        stripeUrl: null
    });
    const [restaurant, setRestaurant] = useState<IRestaurant>();
    const [totalPrice, setTotalPrice] = useState(0);
    const [guests, setGuests] = useState(1);

    useEffect(() => {
        let total = 0;
        for (let item of initialCartItems) {
            total += item.price;
            const storedCartItem = cart.getCartItems().find(ci => ci.itemId === item.id);
            if (storedCartItem) {
                item.quantity = storedCartItem.quantity;
            }
        }
        console.log("ВСТАВИЛ")
        setTotalPrice(total);
    }, [initialCartItems]);

    useEffect(() => {
        const res = cart.getRestaurant();
        if (res) {
            console.log("SET")
            setRestaurant(res)
        }
    }, [])


    const handleRemove = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        cart.removeFromCart(id)
        setToastMessage('Предмет убран из корзины!')
        setShowToast(true);
    };

    const handleBooking = () => {
        setBooking((prevState) => {
            return {
                ...prevState,
                timeStart: prevState.timeStart,
                timeEnd: prevState.timeEnd,
                guests: guests
            }
        });

        const dateStart = booking.timeStart.split('T')[0];
        const timeStart = booking.timeStart.split('T')[1].slice(0, 5);
        const dateEnd = booking.timeEnd.split('T')[0];
        const timeEnd = booking.timeEnd.split('T')[1].slice(0, 5);

        if ((dateStart !== dateEnd || booking.timeStart >= booking.timeEnd)
            || (restaurant && (timeStart >= restaurant.timeClosed || timeStart <= restaurant.timeOpen))
            || (restaurant && (timeEnd >= restaurant.timeClosed || timeEnd <= restaurant.timeOpen))) {
            setToastMessage('Укажите корректное время!')
            setShowToast(true);
            return;
        }
        mainApi.createBooking(booking).then(r => {
            window.location.href = r
        });
    }

    const handleGuestsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGuests(e.target.valueAsNumber);
    };

    const handleTimeChange = (date: string, time: string) => {
        setBooking((prevState) => {
            return {
                ...prevState,
                timeStart: `${date}T${time}${prevState.timeStart.slice(16)}`,
            };
        });
    };

    const handleTimeEndChange = (date: string, time: string) => {
        setBooking((prevState) => {
            return {
                ...prevState,
                timeEnd: `${date}T${time}${prevState.timeEnd.slice(16)}`,
            };
        });
    };


    return (
        <div className={"container skill-bx"}>
            <div className="cart-name wow zoomIn">
                <h1>Корзина</h1>
                <div>
                    <p>Заказ в ресторане: <span>{restaurant?.name}</span></p>
                    <p>Время работы: {restaurant?.timeOpen} - {restaurant?.timeClosed}</p>
                    <p>Общая стоимость: {totalPrice}</p>
                </div>
            </div>
            <div className="d-flex justify-content-center pt-5">
                <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onRemove={() => handleRemove(item.id)}
                            />
                        ))
                    ) : (
                        <p>Добавьте предметы в корзину, зайдя на страницы ресторанов</p>
                    )}
                </div>
            </div>
            {cartItems.length > 0 && (
                <div className={"mt-3"}>
                    <div className={"d-flex justify-content-center gap-2 flex-row flex-wrap"}>
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
                    </div>
                    <div className={"m-auto w-25 d-flex justify-content-center flex-column"}>
                        <Form.Label>Количество гостей:</Form.Label>
                        <Form.Control type={"number"} min={1} defaultValue={1} onChange={handleGuestsChange}/>
                    </div>
                    <div className="m-auto w-25 d-flex justify-content-center">
                        <button className="cafe-button" type='submit' onClick={handleBooking}>Бронировать</button>
                    </div>
                </div>
            )}
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={2000}
                autohide
                bg={'danger'}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    minWidth: 200,
                }}
            >
                <Toast.Header>
                    <strong className="mr-auto">Уведомление</strong>
                </Toast.Header>
                <Toast.Body className="text-black">{toastMessage}</Toast.Body>
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
