import {GetServerSideProps} from 'next';
import React, {ChangeEvent, useEffect, useState} from "react";
import mainApi from "@component/mixin/mainApi";
import IRestaurant from "@component/models/IRestaurant";
import IMenu from "@component/models/IMenu";
import MenuList from "@component/components/MenuList";
import IBooking from "@component/models/IBooking";
import TimePicker from "@component/input/timepicker";
import {Form, Toast} from "react-bootstrap";
import cart from "@component/store/cart";
import {getLocalTimeZone, now} from "@internationalized/date";


interface RestaurantProps {
    initRestaurant: IRestaurant;
    initMenu: IMenu;
}

const Restaurant: React.FC<RestaurantProps> = ({initRestaurant, initMenu}) => {
    const [showToast, setShowToast] = React.useState(false);
    const [restaurant, setRestaurant] = useState<IRestaurant>(initRestaurant);
    const [menu, setMenu] = useState<IMenu>(initMenu);
    const [shouldCreateBooking, setShouldCreateBooking] = useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastVariant, setToastVariant] = React.useState('success');
    const [booking, setBooking] = useState<IBooking>({
        id: null,
        restaurant: null,
        userId: '',
        restaurantId: initRestaurant.id,
        timeStart: now(getLocalTimeZone()).toString(),
        timeEnd: now(getLocalTimeZone()).toString(),
        guests: 1,
        stripeSessionId: null,
        stripeUrl: null,
        preorder: []
    });
    const [guests, setGuests] = useState(1);

    const handleAdd = (id: number) => {
        if (restaurant) {
            cart.addToCart(restaurant, id)
        }
        setToastVariant('success')
        setToastMessage('Предмет добавлен в корзину!')
        setShowToast(true)
        console.log("cart: ", cart)
    };

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
            setToastVariant("danger")
            setToastMessage('Укажите корректное время!')
            setShowToast(true);
            return;
        }
        mainApi.createBookingNoPreorder(booking).then(res => {
            if (res) {
                setToastVariant('success')
                setToastMessage('Вы успешно забронировали кафе без предзаказа!')
                setShowToast(true)
            }
        });
    }


    const handleGuestsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setGuests(e.target.valueAsNumber);
    };

    return (
        <section className="skill" id="skills">
            <div className="container skill-bx p-2 pt-4">
                <div className="wow zoomIn">
                    <h1>{restaurant?.name}</h1>
                    <p>{restaurant?.description}</p>
                    <p>Время работы: {restaurant?.timeOpen} - {restaurant?.timeClosed}</p>
                </div>
                <p className={"mb-3"}>Сделайте бронь через нашу систему! Авторизуйтесь, укажите время для брони!</p>
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
                <p>Или вы можете выбрать блюда из этого меню и оформить бронирование в нашей корзине!</p>
            </div>
            <div className="container skill-bx mt-5 p-2">
                {
                    menu &&
                    <MenuList
                        menu={menu}
                        restaurant={restaurant}
                        addToPreorder={handleAdd}
                    />
                }
                {
                    !menu && <div>404 - Меню не найдено</div>
                }
            </div>
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={2000}
                autohide
                bg={toastVariant}
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
        </section>
    );
};

export const getServerSideProps: GetServerSideProps<RestaurantProps> = async (context) => {
    const {id} = context.query;

    const validId = typeof id === 'string' ? id : '';

    const restaurant = await mainApi.getRestaurantById(validId);
    const menu = await mainApi.getRestaurantMenuById(validId);

    return {
        props: {
            initRestaurant: restaurant,
            initMenu: menu
        },
    };
};

export default Restaurant;