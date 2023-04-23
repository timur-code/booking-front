import IMenuItem from "@component/models/IMenuItem";

interface IMenu {
    id: number;
    name: string;
    description: string;
    language: string;
    menuItems: IMenuItem[];
}

export default IMenu;