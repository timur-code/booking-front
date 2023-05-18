import React, { useEffect, useState } from 'react';
import IMenuItem from "@component/models/IMenuItem";
import mainApi from "@component/mixin/mainApi";


interface CartItemProps {
    item: IMenuItem;
    quantity: number | undefined;
    onRemove: () => void;
    // onUpdate: (quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, quantity, onRemove }) => {
    console.log("item", item)
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

                    <button onClick={onRemove} type="submit" className="card-button">Remove from Cart</button>
                </div>
            {/*<button onClick={() => onUpdate(quantity ? quantity + 1 : 0)}>+</button>*/}
            {/*<button onClick={() => onUpdate(quantity ? quantity - 1 : 0)}>-</button>*/}
            </div>
        </div>
    );
};

export default CartItem;
