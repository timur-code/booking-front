import React, {useEffect, useState} from 'react';
import {GetServerSideProps} from "next";
import IRestaurant from "@component/models/IRestaurant";
import mainApi from "@component/mixin/mainApi";
import RestaurantCard from "@component/components/RestaurantCard";
import { Pagination } from 'react-bootstrap';

interface RestaurantPageProps {
    initialRestaurants: IRestaurant[],
    totalPages: number,
    totalElements: number;
}

const IndexPage: React.FC<RestaurantPageProps> = ({initialRestaurants, totalPages, totalElements}) => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>(initialRestaurants);
    const [pageNum, setPageNum] = useState<number>(1);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await mainApi.listRestaurant(pageNum);
                setRestaurants(response.content);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            }
        };

        fetchRestaurants();
    }, [pageNum]);

    // Function to handle page change
    const handlePageChange = (pageNumber: number) => {
        setPageNum(pageNumber);
    };

    let paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === pageNum} onClick={() => handlePageChange(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    return (
        <div>
            <div>
                <div className="center-large">
                    <section className="skill" id="skills">
                        <div className="container skill-bx">
                            <div className="wow zoomIn">
                                <h1>Рестораны</h1>

                            </div>
                            <div className="d-flex justify-content-center pt-5">
                                <div className="restaurant-list d-flex justify-content-around gap-5 flex-wrap">
                                    {restaurants.map((restaurant) => (
                                        <RestaurantCard key={restaurant.id} restaurant={restaurant}/>
                                    ))}
                                </div>
                            </div>
                            <div className="d-flex justify-content-center pt-5">
                                <Pagination className={"custom-pagination"}>{paginationItems}</Pagination>
                            </div>
                        </div>

                    </section>
                </div>
            </div>
        </div>
    );
};

export const getServerSideProps: GetServerSideProps<RestaurantPageProps> = async (context) => {
    const pageNum = 1;

    const response = await mainApi.listRestaurant(pageNum);
    console.log("RESPONSE: ", response)
    return {
        props: {
            initialRestaurants: response.content,
            totalPages: response.totalPages,
            totalElements: response.totalElements
        },
    };
}

export default IndexPage;