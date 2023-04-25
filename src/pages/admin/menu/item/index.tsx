import {GetServerSideProps} from 'next';
import React, {ChangeEvent, FormEvent, useState} from "react";
import {Button, Form} from "react-bootstrap";
import adminApi from "@component/mixin/adminApi";
import {useRouter} from "next/router";
import cookie from "cookie";

const AdminRestaurantIndex = () => {
    const [name, setName] = useState<string>('');
    const [menuId, setMenuId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleMenuChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMenuId(e.target.value);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (typeof menuId === 'undefined') {
            return;
        }
        try {
            const data = await adminApi.createMenuItem({
                menuId,
                name,
                description
            });
            console.log("Menu ITEM success: ", data);
            await router.push("/admin/menu")
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
                        <div className="h1">Добавление Блюда</div>
                        <Form.Group className="mb-3">
                            <Form.Label>Номер Меню</Form.Label>
                            <Form.Control type="number" placeholder="" onChange={handleMenuChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Название</Form.Label>
                            <Form.Control type="text" placeholder="" onChange={handleNameChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control type="text" placeholder="Введите пароль" onChange={handleDescriptionChange}/>
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
        console.log("isAdmin ", isAdmin)
        if (isAdmin) {
            showModal = false;
        }
    } catch (error) {
        console.error('Error checking admin status:', error);
    }

    return {
        props: {showModal},
    };
}

export default AdminRestaurantIndex;