import React from 'react';
import RestaurantList from "@component/components/RestaurantList";
import Image from "next/image";

const LoginPage = () => {

    return (
        <div>
        <div>
            {/*<div className="index-bg-img">
                <Image
                    src="/bag.jpg"
                    alt="Picture of the author"
                    fill={true}
                    priority
                />
            </div>*/}
            <div className="center-large">
                <RestaurantList/>
            </div>
        </div>
        </div>
    );
};

export default LoginPage;