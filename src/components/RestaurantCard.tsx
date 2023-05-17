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
        <div className="border-card">
            <div className="wrap-card">
                <Link className="lister-card border border-success mb-2 border-opacity-25 d-flex rounded text-decoration-none"
                      href={`/restaurant/${restaurant.id}`}
                      style={cardStyle}
                >
                <div className="loop-action-card">
                    <a href="" className="add-to-cart">Choose</a>
                </div>
                </Link>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.description}</p>
            </div>
        </div>

    );
};

export default RestaurantCard;