import {Button, Form, Toast} from "react-bootstrap";
import {GetServerSideProps} from "next";
import cookie from "cookie";
import IUser from "@component/models/IUser";
import React, {ChangeEvent, FormEvent, useState} from "react";
import userApi from "@component/mixin/userApi";

interface ProfileProps {
    userProp: IUser;
}

const Profile: React.FC<ProfileProps> = ({userProp}) => {
    const [user, setUser] = useState(userProp);
    const [showToast, setShowToast] = React.useState(false);
    const [toastMessage, setToastMessage] = React.useState('');

    const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({...user, firstName: e.target.value});
    };

    const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({...user, lastName: e.target.value});
    };

    const checkLength = () => {
        if (user.firstName.length === 0) {
            throw new Error('Введите имя')
        }
        if (user.lastName.length === 0) {
            throw new Error('Введите фамилию')
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
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
            await userApi.changeUser(user)
        } catch (error: any) {
            setToastMessage('An unexpected error occurred.');
            setShowToast(true)
        }
    };

    return (
        <div>
            <div className={"m-auto w-50 container skill-bx mt-2 mb-2"}>
                <h1>Профиль</h1>
                <Form className={"w-50 justify-content-center pt-5 container"} onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Ваше имя</Form.Label>
                        <Form.Control type="text" value={user.firstName} onChange={handleFirstNameChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ваша фамилия</Form.Label>
                        <Form.Control type="text" value={user.lastName} onChange={handleLastNameChange}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Ваш телефон</Form.Label>
                        <Form.Control readOnly disabled={true} type="tel" value={user.phone}/>
                    </Form.Group>
                    <Button className={"mt-5 cafe-button " } type="submit">Изменить</Button>
                </Form>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = cookie.parse(context.req.headers.cookie || '');
    const res: IUser = JSON.parse(cookies.me);
    return {props: {userProp: res}};
}

export default Profile;