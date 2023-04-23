import {GetServerSideProps} from 'next';
import Image from "next/image";
import React, {useEffect, useState} from "react";
import mainApi from "@component/mixin/mainApi";
import IRestaurant from "@component/models/IRestaurant";
import {notFound} from "next/navigation";

interface RestaurantProps {
    id: string;
}

const Restaurant: React.FC<RestaurantProps> = ({id}) => {
    const [restaurant, setRestaurant] = useState<IRestaurant>();

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                return await mainApi.getRestaurantById(id);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            }
        };

        //TODO: Called twice idk why
        fetchRestaurant().then(res => setRestaurant(res));
    }, []);


    if (!restaurant) {
        //set not found
    }
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
                {/* Render your restaurant data */}
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