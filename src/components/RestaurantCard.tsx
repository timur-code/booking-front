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
        backgroundImage: restaurant.img ? `url(${restaurant.img})` : 'url(/item.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <Link className="lister-card border border-success mb-2 border-opacity-25 d-flex rounded text-decoration-none"
              href={`/restaurant/${restaurant.id}`}
              style={cardStyle}
        >
            <div className="lister-card-text text-white p-3 d-flex flex-column justify-content-end">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
            </div>
        </Link>
    );
};

export default RestaurantCard;