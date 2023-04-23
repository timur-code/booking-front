import React from 'react';
import IRestaurant from "@component/models/IRestaurant";
import Router from "next/router";
import Link from "next/link";

interface RestaurantProps {
    restaurant: IRestaurant;
}

const RestaurantCard: React.FC<RestaurantProps> = ({restaurant}) => {
    const handleClick = async (restaurant: IRestaurant) => {
        console.log("Click")
        await Router.push(`/restaurant/${restaurant.id}`);
    }

    const cardStyle = {
        backgroundImage: restaurant.img ? `url(${restaurant.img})` : 'url(/pasta.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="restaurant-card border border-success mb-2 border-opacity-25 d-flex rounded"
             style={cardStyle}
             onClick={() => handleClick(restaurant)}
        >
            <div className="restaurant-text text-white p-3 d-flex flex-column justify-content-end">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
            </div>
        </div>
    );
};

export default RestaurantCard;