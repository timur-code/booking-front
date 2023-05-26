import React, {ChangeEvent, FormEvent, useContext, useState} from 'react';
import {Modal, Form, Button} from 'react-bootstrap';

import userApi from "@component/mixin/userApi";
import IModalProps from './IModal';
import Router, {useRouter} from "next/router";


const RegisterModal: React.FC<IModalProps> = ({onClose, show}) => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
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

    const handleFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = await userApi.register(phoneNumber, password, firstName, lastName);
            console.log("Register success: ", data);
            onClose();
            Router.reload();
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration.');
        }
    };

    return (
        <Modal className="text-dark" show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Регистрация</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} >
                    <Form.Group className="mb-3 ">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control type="text" placeholder="Введите имя" onChange={handleFirstNameChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3 ">
                        <Form.Label>Фамилия</Form.Label>
                        <Form.Control type="text" placeholder="Введите фамилию" onChange={handleLastNameChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Номер телефона</Form.Label>
                        <Form.Control type="tel" placeholder="Введите телефон" onChange={handlePhoneNumberChange}/>
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

export default RegisterModal;