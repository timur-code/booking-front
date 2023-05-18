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

    return (
        <div>
            <h2>{item.name}</h2>
            <p>Price: {item.price}</p>
            <button onClick={onRemove}>Remove from Cart</button>
            {/*<button onClick={() => onUpdate(quantity ? quantity + 1 : 0)}>+</button>*/}
            {/*<button onClick={() => onUpdate(quantity ? quantity - 1 : 0)}>-</button>*/}
        </div>
    );
};

export default CartItem;
