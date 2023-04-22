import React from 'react';
import IRestaurant from "@component/models/IRestaurant";
import Router from "next/router";

interface RestaurantProps {
    restaurant: IRestaurant;
}

const RestaurantCard: React.FC<RestaurantProps> = ({ restaurant }) => {
    const handleClick = async (restaurant: IRestaurant) => {
        console.log("Click")
        await Router.push(`/restaurant/${restaurant.id}`);
    }

    return (
        <div className="restaurant-card border border-success p-2 mb-2 border-opacity-25"
             onClick={() => handleClick(restaurant)}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
        </div>
    );
};

export default RestaurantCard;