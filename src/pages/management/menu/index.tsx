import {GetServerSideProps} from 'next';
import React, {ChangeEvent, FormEvent, useState} from "react";
import {Button, Form} from "react-bootstrap";
import adminApi from "@component/mixin/adminApi";
import {useRouter} from "next/router";
import IRestaurant from "@component/models/IRestaurant";

interface ManagementMenuProps {
    restaurant: IRestaurant
}

const ManagementMenuPage: React.FC<ManagementMenuProps> = ({restaurant}) => {
    const [name, setName] = useState<string>('');
    const [restaurantId, setRestaurantId] = useState<number>(restaurant.id);
    const [price, setPrice] = useState<number>(restaurant.id);
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.valueAsNumber);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setImage(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (typeof restaurantId === 'undefined') {
            return;
        }
        try {
            const data = await adminApi.createMenuItem({
                restaurantId,
                name,
                description,
                price,
                images: [image]
            });
            console.log("Menu ITEM success: ", data);
            await router.push("/management/menu")

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
                            <Form.Label>Название</Form.Label>
                            <Form.Control type="text" placeholder="Введите название" onChange={handleNameChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Описание</Form.Label>
                            <Form.Control type="text" placeholder="Введите пароль" onChange={handleDescriptionChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Цена</Form.Label>
                            <Form.Control type="number" placeholder="Введите цену" onChange={handlePriceChange}/>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Картинка</Form.Label>
                            <Form.Control type="text" placeholder="Введите ссылку" onChange={handleImageChange}/>
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
    let res
    try {
        res = await adminApi.getMyRes(context);
    } catch (ex: any) {
        if (context.res) {
            context.res.writeHead(302, {Location: '/management/login'});
            context.res.end();
        }
    }
    if (!res) {
        if (context.res) {
            context.res.writeHead(302, {Location: '/management/login'});
            context.res.end();
        }
    }

    return {
        props: {
            restaurant: res
        },
    };
}

export default ManagementMenuPage;