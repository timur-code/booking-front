import {GetServerSideProps} from 'next';
import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {Button, Form} from "react-bootstrap";
import adminApi from "@component/mixin/adminApi";
import {useRouter} from "next/router";
import cookie from "cookie";

const AdminRestaurantIndex = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [seats, setSeats] = useState<number>(1);
    const [adminPhone, setAdminPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleSeatsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSeats(e.target.valueAsNumber);
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAdminPhone(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImage(e.target.value);
    };

    const checkLength = () => {
        if (name.length === 0) {
            throw new Error('Введите название')
        }
        if (description.length < 10) {
            throw new Error('Введите описание')
        }
        if (seats == null || seats < 1) {
            throw new Error('Укажите количество мест')
        }
        if (adminPhone.length !== 12) {
            throw new Error('Минимальная длинна телефона 12')
        }
        if (password.length < 6) {
            throw new Error('Минимальная длинна пароля 6')
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            checkLength()
        } catch (ex) {
            if (ex instanceof Error) {
                setError(ex.message);
            } else {
                setError('An unexpected error occurred.');
            }
            return;
        }
        try {
            const data = await adminApi.createRes({
                name,
                description,
                seats,
                adminPhone,
                password,
                image
            });
            console.log("RESTAURANT success: ", data);
            await router.push("/admin/restaurant")
            // Redirect to the dashboard or another protected page
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
        }
    };

    return (
        <div>
            <div className="center-large mt-3">
                <div className="border border-1 rounded d-flex flex-column p-3 gap-1">
                    <Form onSubmit={handleSubmit}>
                        <div className="h1">Добавление ресторана</div>
                        <Form.Group className="mb-3">
                            <Form.Label>Название</Form.Label>
                            <Form.Control type="text" placeholder="Введите название" onChange={handleNameChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control type="text" placeholder="Введите описание" onChange={handleDescriptionChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Количество мест</Form.Label>
                            <Form.Control type="number" min={1} placeholder="Введите число" onChange={handleSeatsChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Картинка</Form.Label>
                            <Form.Control type="text" placeholder="Введите ссылку" onChange={handleImageChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Номер телефона администратора ресторана</Form.Label>
                            <Form.Control minLength={12} maxLength={12} type="text" placeholder="Введите номер телефона" onChange={handlePhoneChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control minLength={6} maxLength={20} type="password" placeholder="Введите пароль" onChange={handlePasswordChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Добавить
                        </Button>
                        {error && <div>{error}</div>}
                    </Form>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    let showModal = true;

    // Parse cookies from the request headers
    const cookies = cookie.parse(context.req.headers.cookie || '');

    try {
        const isAdmin = await adminApi.isAdmin(cookies.access_token);
        console.log("isAdmin ",isAdmin)
        if (isAdmin) {
            showModal = false;
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
    }

    return {
        props: { showModal },
    };
}

export default AdminRestaurantIndex;