import React from 'react';
import IRestaurant from "@component/models/IRestaurant";
import Router from "next/router";
import Link from "next/link";
import IMenu from "@component/models/IMenu";
import IMenuItem from "@component/models/IMenuItem";

interface MenuCardProps {
    item: IMenuItem;
    restaurantId: number;
    addToPreorder: (itemId: number) => void;
}

const RestaurantCard: React.FC<MenuCardProps> = ({item, restaurantId, addToPreorder}) => {

    const handleAdd = () => {
        addToPreorder(item.id);
    }

    const cardStyle = {
        backgroundImage: (item && item.images.length > 0) ? `url(${item.images[0]})` : 'url(/pasta.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="lister-card border border-success mb-2 border-opacity-25 d-flex rounded"
             style={cardStyle}
        >
            <div className="lister-card-text text-white p-3 d-flex flex-column justify-content-end">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <button onClick={handleAdd}>Add</button>
            </div>
        </div>
    );
};

export default RestaurantCard;