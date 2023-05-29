import React, {ChangeEvent, useState} from 'react';
import mainApi from "@component/mixin/mainApi";
import {Toast} from "react-bootstrap";

const Support: React.FC = ({}) => {
    const [phone, setPhone] = useState<string>("");
    const [text, setText] = useState<string>("");
    const [showToast, setShowToast] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    const checkLength = () => {
        if (phone.length !== 12) {
            throw new Error('Минимальная длинна телефона 12')
        }
        if (text.length === 0) {
            throw new Error('Опишите проблему')
        }
    }

    const handleClick = async () => {
        setToastMessage('');

        try {
            checkLength()
        } catch (ex) {
            if (ex instanceof Error) {
                setToastMessage(ex.message);
            } else {
                setToastMessage('An unexpected error occurred.');
            }
            setShowToast(true)
            return;
        }

        try {
            await mainApi.createSupportRequest({phone, text})
        } catch (error: any) {

        }
    };

    return (
        <div>
            <div className="cart-name wow zoomIn">
                <h1>Поддержка</h1>
            </div>

            <div className="d-flex justify-content-center pt-5">

                <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">
                    <form>
                        <label className="restaurant-list d-flex justify-content-center gap-4 flex-wrap rounded-sm">
                            <input type="text" name="phone" minLength={12} maxLength={12} onChange={handlePhoneChange}
                                   className="col-11 pt-2 mb-3 rounded-lg" placeholder="Ваш номер телефона"/>
                            <input type="text" name="text" minLength={1} onChange={handleTextChange} className="col-11 pt-2 mb-3"
                                   placeholder="Описание проблемы"/>
                        </label>
                        <input type="button" onClick={handleClick} value="Отправить" className="cafe-button mb-4"/>
                    </form>

                </div>
            </div>

            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={2000}
                autohide
                bg={"danger"}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    minWidth: 200,
                }}
            >
                <Toast.Header>
                    <strong className="mr-auto">Уведомление</strong>
                </Toast.Header>
                <Toast.Body className="text-black">{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default Support;
