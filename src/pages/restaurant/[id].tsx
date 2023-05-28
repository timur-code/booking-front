import {GetServerSideProps} from 'next';
import React, {useEffect, useState} from "react";
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
    id: number;
}

const Restaurant: React.FC<RestaurantProps> = ({id}) => {
    const [showToast, setShowToast] = React.useState(false);
    const [restaurant, setRestaurant] = useState<IRestaurant>();
    const [menu, setMenu] = useState<IMenu>();
    const [shouldCreateBooking, setShouldCreateBooking] = useState(false);
    const [toastMessage, setToastMessage] = React.useState('');
    const [toastVariant, setToastVariant] = React.useState('success');
    const [booking, setBooking] = useState<IBooking>({
        id: null,
        restaurant: null,
        userId: '',
        restaurantId: id,
        timeStart: now(getLocalTimeZone()).toString(), // You can set an initial value if needed
        timeEnd: now(getLocalTimeZone()).toString(),
        guests: 1,
        stripeSessionId: null,
        stripeUrl: null,
        preorder: []
    });
    console.log("cart: ", cart)

    const handleAdd = (id: number) => {
        if (restaurant) {
            cart.addToCart(restaurant.id, id)
        }
        setToastVariant('success')
        setToastMessage('Предмет добавлен в корзину!')
        setShowToast(true)
        console.log("cart: ", cart)
    };

    useEffect(() => {
        if (shouldCreateBooking) {
            mainApi.createBooking(booking).then(resId => {
                setBooking((prevState) => {
                    return {
                        ...prevState,
                        id: resId
                    };
                });
            });
            setShouldCreateBooking(false);
        }
    }, [booking, shouldCreateBooking]);


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
                timeEnd: prevState.timeEnd
            }
        });
        const dateStart = booking.timeStart.split('T')[0];
        const dateEnd = booking.timeEnd.split('T')[0];

        if (dateStart !== dateEnd || booking.timeStart >= booking.timeEnd) {
            setToastVariant("danger")
            setToastMessage('Укажите корректное время!')
            setShowToast(true);
            return;
        }
        mainApi.createBooking(booking).then(res => {
            if (res.length > 0) {
                setToastVariant('success')
                setToastMessage('Вы успешно забронировали кафе без предзаказа!')
                setShowToast(true)
            }
        });
    }

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                return await mainApi.getRestaurantById(id);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            }
        };
        const fetchMenu = async () => {
            try {
                return await mainApi.getRestaurantMenuById(id);
            } catch (error) {
                console.error('Failed to fetch menu:', error);
            }
        };

        //TODO: Called twice idk why
        fetchRestaurant().then(res => setRestaurant(res));
        //TODO: Called twice idk why
        fetchMenu().then(res => setMenu(res));

    }, []);

    return (
        <section className="skill" id="skills">
            <div className="container skill-bx">
                <div className="wow zoomIn">
                    <h1>{restaurant?.name}</h1>
                    <p>{restaurant?.description}</p>
                </div>
                <p>Сделайте бронь через нашу систему! Авторизуйтесь, укажите время для брони!</p>
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
                <p>Или вы можете выбрать блюда из этого меню и оформить бронирование в нашей корзине!</p>
                {
                    menu &&
                    <MenuList
                        menu={menu}
                        restaurantId={id}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {id} = context.query;

    const validId = typeof id === 'string' ? id : '';

    return {
        props: {
            id: validId
        },
    };
};

export default Restaurant;