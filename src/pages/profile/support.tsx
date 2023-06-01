import React, {ChangeEvent, useState} from 'react';
import mainApi from "@component/mixin/mainApi";

const Support: React.FC = ({}) => {
    const [phone, setPhone] = useState<string>("");
    const [text, setText] = useState<string>("");

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const handleClick = async () => {
        try {
            await mainApi.createSupportRequest({phone, text})
        } catch (error: any) {

        }
    };

    const handleUpdate = (id: number, restaurantId: number, quantity: number) => {
        // Handle cart item quantity update
    };

    return (
        <div className={"skill-bx"}>
            <div className="cart-name">
                <h1>Поддержка</h1>
            </div>

            <div className="d-flex justify-content-center pt-5">

                <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">
                    <form>
                        <label className="restaurant-list d-flex gap-4 flex-wrap rounded-sm">
                            <input type="text" name="phone" onChange={handlePhoneChange}
                                   className="col-11 pt-2 mb-3 rounded-lg" placeholder="Phone number"/>
                            <input type="text" name="text" onChange={handleTextChange} className="col-11 pt-2 mb-3"
                                   placeholder="Text"/>
                        </label>
                        <input type="button" onClick={handleClick} value="Submit" className="cafe-button mb-4"/>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default Support;
