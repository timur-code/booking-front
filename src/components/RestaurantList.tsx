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
        <div className="d-flex justify-content-center pt-5">
            <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">
                {restaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant}/>
                ))}
            </div>
        </div>
    );
};

export default RestaurantList;
