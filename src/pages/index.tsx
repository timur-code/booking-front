import React from 'react';
import RestaurantList from "@component/components/RestaurantList";

const IndexPage = () => {

    return (
        <div>
            <div>
                <div className="center-large">
                    <RestaurantList/>
                </div>
            </div>
        </div>
    );
};

export default IndexPage;