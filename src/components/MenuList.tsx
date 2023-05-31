import React from 'react';
import IMenu from "@component/models/IMenu";
import MenuCard from "@component/components/MenuCard";
import IRestaurant from "@component/models/IRestaurant";

interface MenuListProps {
    menu: IMenu
    restaurant: IRestaurant
    addToPreorder: (itemId: number) => void;
}

const MenuList: React.FC<MenuListProps> = ({menu, restaurant, addToPreorder}) => {
    return (
        <div className="d-flex justify-content-center flex-column">
            <div className=" wow zoomIn">
                <h1>Меню</h1>
            </div>
            <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">
                {menu?.menuItems.map(item => (
                    <MenuCard
                        key={item.id}
                        item={item}
                        restaurantId={restaurant.id}
                        addToPreorder={addToPreorder}
                    ></MenuCard>
                ))}
            </div>
        </div>
    );
};

export default MenuList;
