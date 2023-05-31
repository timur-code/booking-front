import React from 'react';
import IRestaurant from "@component/models/IRestaurant";
import Router from "next/router";
import Link from "next/link";


interface RestaurantProps {
    restaurant: IRestaurant;
}

const RestaurantCard: React.FC<RestaurantProps> = ({restaurant}) => {

    const cardStyle = {
        backgroundImage: restaurant.image ? `url(${restaurant.image})` : 'url(/item.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="border-card">
            <div className="wrap-card">
                <Link
                    href={`/restaurant/${restaurant.id}`}
                    className="lister-card border border-success mb-2 border-opacity-25 d-flex rounded text-decoration-none"
                    style={cardStyle}
                >
                    <div className="loop-action-card">
                        <div>
                            Открыть
                        </div>
                    </div>
                </Link>
                <h3>{restaurant.name}</h3>
                <div>{restaurant.description}</div>
                <div>{restaurant.location}</div>
            </div>
        </div>
    );
};

export default RestaurantCard;