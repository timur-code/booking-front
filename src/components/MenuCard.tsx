import React from 'react';
import IRestaurant from "@component/models/IRestaurant";
import Router from "next/router";
import Link from "next/link";
import IMenu from "@component/models/IMenu";
import IMenuItem from "@component/models/IMenuItem";

interface MenuCardProps {
    item: IMenuItem;
    restaurantId: number;
    addToPreorder: (itemId: number, quantity: number) => void;
}

const RestaurantCard: React.FC<MenuCardProps> = ({item, addToPreorder}) => {

    const handleAdd = () => {
        addToPreorder(item.id, 1);
    }

    const cardStyle = {
        backgroundImage: (item && item.images.length > 0) ? `url(${item.images[0]})` : 'url(/item.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    return (
        <div className="border-card">
            <div className="wrap-card">
                <div className="lister-card border border-success mb-2 border-opacity-25 d-flex rounded"
                     style={cardStyle}
                />
                    <div>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>

                        <button className="loop-action-card">
                            <a onClick={handleAdd}>Add</a>
                        </button>
                    </div>
            </div>
        </div>
    );
};

export default RestaurantCard;