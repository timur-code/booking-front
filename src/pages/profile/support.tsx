import React from 'react';
import CartItem from '@component/components/CartItem';
import cart from "@component/store/cart";
import mainApi from "@component/mixin/mainApi";
import IMenuItem from "@component/models/IMenuItem";
import {GetServerSideProps} from "next";
import cookie from "cookie";
import {Form} from "react-bootstrap";
import TimePicker from "@component/input/timepicker";
import {Input} from "postcss";

const Support: React.FC<{ initialCartItems: Array<IMenuItem> }> = ({initialCartItems}) => {

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
                <h1>Поддержка</h1>

            </div>

            <div className="d-flex justify-content-center pt-5">

                <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">
                    <form >
                        <label className="restaurant-list d-flex justify-content-center gap-4 flex-wrap rounded-sm">
                            <input type="text" name="phone" className="col-11 pt-2 mb-3 rounded-lg" placeholder="Phone number"/>
                            <input type="text" name="text"  className="col-11 pt-2 mb-3" placeholder="Text"/>
                        </label>
                        <input type="submit" value="Submit" className="cafe-button mb-4" />
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Support;
