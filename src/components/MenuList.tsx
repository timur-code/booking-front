import React from 'react';
import IMenu from "@component/models/IMenu";
import MenuCard from "@component/components/MenuCard";

interface MenuListProps {
    menu: IMenu
    restaurantId: number
    addToPreorder: (itemId: number) => void;
}

const MenuList: React.FC<MenuListProps> = ({menu, restaurantId, addToPreorder}) => {
    return (
        <div className="d-flex justify-content-center pt-5 flex-column">
            <div className=" wow zoomIn">
                <h1>Menu</h1>
            </div>
            <div className="restaurant-list d-flex justify-content-around gap-3 flex-wrap">
                {menu?.menuItems.map(item => (
                    <MenuCard

                        key={item.id}
                        item={item}
                        restaurantId={restaurantId}
                        addToPreorder={addToPreorder}
                    ></MenuCard>
                ))}
            </div>
        </div>
    );
};

export default MenuList;
