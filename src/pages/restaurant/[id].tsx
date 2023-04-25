import {GetServerSideProps} from 'next';
import Image from "next/image";
import React, {useEffect, useState} from "react";
import mainApi from "@component/mixin/mainApi";
import IRestaurant from "@component/models/IRestaurant";
import IMenu from "@component/models/IMenu";
import MenuList from "@component/components/MenuList";
import IBooking from "@component/models/IBooking";
import TimePicker from "@component/input/timepicker";
import {Form} from "react-bootstrap";


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

    const addToPreorder = (itemId: number) => {
        setBooking((prevState) => {
            return {
                ...prevState,
                preorder: [...prevState.preorder, itemId]
            };
        });
        setShouldCreateBooking(true);
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
        <div>
            <div className="index-bg-img">
                <Image
                    src="/bg.jpg"
                    alt="Picture of the author"
                    fill={true}
                    priority
                />
            </div>
            <div className="center-large mt-3">
                <div className="d-flex flex-column">
                    <h1>{restaurant?.name}</h1>
                    <p>{restaurant?.description}</p>
                </div>
                <div className="border border-1 rounded d-flex flex-column p-3 gap-1">
                    <p>Сделайте бронь через нашу систему! Авторизуйтесь, укажите время для брони и предзакажите еду из
                        меню</p>
                    <Form.Label>Укажите время:</Form.Label>
                    <TimePicker
                        timeStart={booking.timeStart}
                        onTimeChange={(date, time) => handleTimeChange(date, time)}
                    />
                    <button className="btn btn-success" onClick={handleBooking}>Бронировать</button>
                </div>
                {
                    menu &&
                    <MenuList
                        menu={menu}
                        restaurantId={id}
                        addToPreorder={addToPreorder}
                    />
                }
                {
                    !menu && <div>404 - Меню не найдено</div>
                }
            </div>
        </div>
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