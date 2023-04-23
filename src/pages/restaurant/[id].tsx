import {GetServerSideProps} from 'next';
import Image from "next/image";
import React, {useEffect, useState} from "react";
import mainApi from "@component/mixin/mainApi";
import IRestaurant from "@component/models/IRestaurant";
import IMenu from "@component/models/IMenu";
import MenuList from "@component/components/MenuList";
import IBooking from "@component/models/IBooking";

interface RestaurantProps {
    id: number;
}

const Restaurant: React.FC<RestaurantProps> = ({id}) => {
    const [restaurant, setRestaurant] = useState<IRestaurant>();
    const [menu, setMenu] = useState<IMenu>();
    const [booking, setBooking] = useState<IBooking>({
        restaurantId: id,
        timeStart: '', // You can set an initial value if needed
        preorder: []
    });

    const addToPreorder = (itemId: number) => {
        setBooking((prevState) => {
            return {
                ...prevState,
                preorder: [...prevState.preorder, itemId]
            };
        });
    };

    const handleTimeChange = (event: any) => {
        setBooking((prevState) => {
            return {
                ...prevState,
                timeStart: event.target.value + ':00Z'
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
        mainApi.createTempBooking(booking).then(r => console.log(r));
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
            <div className="center-large">
                <h1>{restaurant?.name}</h1>
                <p>{restaurant?.description}</p>
                <button className="btn btn-success" onClick={handleBooking}>Бронировать</button>
                <label htmlFor="timePicker">Choose a time:</label>
                <input
                    type="datetime-local"
                    id="timePicker"
                    value={booking.timeStart}
                    onChange={handleTimeChange}
                />
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