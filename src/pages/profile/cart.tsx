import React from 'react';
import CartItem from '@component/components/CartItem';
import cart from "@component/store/cart";
import mainApi from "@component/mixin/mainApi";
import IMenuItem from "@component/models/IMenuItem";
import {GetServerSideProps} from "next";
import cookie from "cookie";

const CartPage: React.FC<{ initialCartItems: Array<IMenuItem> }> = ({initialCartItems}) => {

    const [cartItems, setCartItems] = React.useState(initialCartItems);

    const handleRemove = (id: number) => {
        // Handle removal of cart item
    };

    const handleUpdate = (id: number, restaurantId: number, quantity: number) => {
        // Handle cart item quantity update
    };

    return (
        <div>
            <div className="cart-name wow zoomIn">
                <h1>Restaurants</h1>

            </div>

        <div className="d-flex justify-content-center pt-5">

            <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">

                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                quantity={1}
                                onRemove={() => handleRemove(item.id)}
                            />
                        ))
                    ) : (
                        <p>No items in cart</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    let initialCartItems = new Array<IMenuItem>;

    const cookies = cookie.parse(context.req.headers.cookie || '');

    try {
        initialCartItems = await mainApi.getCartItems(JSON.parse(cookies.cart).items, cookies.access_token);
    } catch (error) {
        console.error('Failed to fetch cart items:', error);
    }

    return {
        props: {
            initialCartItems,
        }
    }
}

export default CartPage;
