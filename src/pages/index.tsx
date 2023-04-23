import React, {useState} from 'react';
import RestaurantList from "@component/components/RestaurantList";
import Image from "next/image";

const LoginPage = () => {

    return (
        <div>
            <div className="index-bg-img">
                <Image
                    src="/bg.jpg"
                    alt="Picture of the author"
                    fill={true}
                    priority
                />
            </div>
            <div className="center-large">
                <RestaurantList/>
            </div>
        </div>
    );
};

export default LoginPage;