import {GetServerSideProps} from 'next';
import React, {ChangeEvent, FormEvent, useState} from "react";
import {Button, Form} from "react-bootstrap";
import adminApi from "@component/mixin/adminApi";
import Router from "next/router";
import cookie from "cookie";

const AdminLoginPage = () => {
    const [phone, setPhone] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const checkLength = () => {
        if (phone.length !== 12) {
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
            const data = await adminApi.login(phone, password);
            console.log("Login success: ", data);
            await Router.push("/admin")
            // Redirect to the dashboard or another protected page
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
        }
    };

    return (
        <div>
            <div className="center-large w-50 mt-3">
                <div className="border border-1 rounded d-flex flex-column p-3 gap-1">
                    <Form onSubmit={handleSubmit}>
                        <div className="h1">Вход</div>
                        <Form.Group className="mb-3">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control minLength={12} maxLength={12} type="text" placeholder="Введите логин" onChange={handlePhoneChange}/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control minLength={6} maxLength={20} type="password" placeholder="Введите пароль" onChange={handlePasswordChange}/>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Войти
                        </Button>
                        {error && <div>{error}</div>}
                    </Form>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = cookie.parse(context.req.headers.cookie || '');
    const res = await adminApi.isAdmin(cookies.access_token);
    if (res) {
        if (context.res) {
            context.res.writeHead(302, {Location: '/admin'});
            context.res.end();
        }
    }
    return {props: {}};
}

export default AdminLoginPage;