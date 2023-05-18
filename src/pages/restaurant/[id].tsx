import {GetServerSideProps} from 'next';
import React, {useEffect, useState} from "react";
import mainApi from "@component/mixin/mainApi";
import IRestaurant from "@component/models/IRestaurant";
import IMenu from "@component/models/IMenu";
import MenuList from "@component/components/MenuList";
import IBooking from "@component/models/IBooking";
import TimePicker from "@component/input/timepicker";
import {Form} from "react-bootstrap";
import cart from "@component/store/cart";


interface RestaurantProps {
    id: number;
}

const Restaurant: React.FC<RestaurantProps> = ({id}) => {
    const [restaurant, setRestaurant] = useState<IRestaurant>();
    const [menu, setMenu] = useState<IMenu>();
    const [shouldCreateBooking, setShouldCreateBooking] = useState(false);
    const [booking, setBooking] = useState<IBooking>({
        id: null,
        restaurantId: id,
        timeStart: '2023-01-01T00:00:00Z', // You can set an initial value if needed
        preorder: []
    });
    console.log("cart: ", cart)

    const handleRemove = (id: number) => {

        console.log("cart: ", cart)
    };

    const handleAdd = (id: number, quantity: number) => {
        if (restaurant) {
            cart.addToCart(restaurant.id, id)
        }
        console.log("cart: ", cart)
    };

    useEffect(() => {
        if (shouldCreateBooking) {
            mainApi.createTempBooking(booking).then(resId => {
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

    const handleBooking = () => {
        setBooking((prevState) => {
            return {
                ...prevState,
                timeStart: prevState.timeStart
            }
        });
        mainApi.confirmBooking(booking.id).then(r => console.log(r));
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
                <div className=" wow zoomIn">
                    <h1>{restaurant?.name}</h1>
                    <p>{restaurant?.description}</p>
                </div>
                <p>Сделайте бронь через нашу систему! Авторизуйтесь, укажите время для брони и предзакажите еду из
                    меню</p>
                <div>

                    <Form.Label>Укажите время:</Form.Label>
                    <div>
                        <TimePicker
                            timeStart={booking.timeStart}
                            onTimeChange={(date, time) => handleTimeChange(date, time)}
                        />

                        <button className="cafe-button" type='submit' onClick={handleBooking}>Бронировать</button>
                    </div>
                </div>
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