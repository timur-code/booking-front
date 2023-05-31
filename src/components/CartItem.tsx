import React from 'react';
import IMenuItem from "@component/models/IMenuItem";


interface CartItemProps {
    item: IMenuItem;
    onRemove: () => void;

}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
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
                    <div>{item.description}</div>
                    <div>Количество: {item.quantity}</div>
                    <div>Цена: {item.price}</div>
                    <button onClick={onRemove} type="submit" className="card-button">Убрать из корзины</button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
