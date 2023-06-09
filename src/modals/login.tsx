import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';

import userApi from "@component/mixin/userApi";
import IModalProps from './IModal';
import {useRouter} from "next/router";

const LoginModal: React.FC<IModalProps> = ({onClose, show}) => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = await userApi.login(phoneNumber, password);
            console.log("Login success: ", data);
            onClose();
            await router.push("/")
            // Redirect to the dashboard or another protected page
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
        }
    };

    return (
        <Modal className="text-dark" show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Вход</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} >
                    <Form.Group className="mb-3">
                        <Form.Label>Номер телефона</Form.Label>
                        <Form.Control type="tel" placeholder="Введите номер телефона" onChange={handlePhoneNumberChange}/>
                    </Form.Group>

                    <Form.Group className="mb-3 ">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control type="password" placeholder="Введите пароль" onChange={handlePasswordChange}/>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Войти
                    </Button>
                    {error && <div>{error}</div>}
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default LoginModal;