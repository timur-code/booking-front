import React, {useEffect, useState} from 'react';
import IRestaurant from "@component/models/IRestaurant";
import RestaurantCard from "@component/components/RestaurantCard";
import mainApi from "@component/mixin/mainApi";

const RestaurantList: React.FC = () => {
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await mainApi.listRestaurant();
                setRestaurants(response);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            }
        };

        fetchRestaurants();
    }, []);

    return (
        <section className="skill" id="skills">
            <div className="container skill-bx">
                <div className=" wow zoomIn">
                    <h1>Restaurants</h1>

                </div>
        <div className="d-flex justify-content-center pt-5">
            <div className="restaurant-list d-flex justify-content-around gap-5 flex-wrap">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant}/>
                ))}
            </div>
        </div>
            </div>
        </section>
    );
};

export default RestaurantList;
