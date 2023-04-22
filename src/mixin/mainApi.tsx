import {reAxios} from "../../axios";
import IRestaurant from "@component/models/IRestaurant";


const mainApi = {
    async listRestaurant() {
        try {
            const response = await reAxios.get('/restaurant/list');
            const fetchedRestaurants: IRestaurant[] = response.data.content.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.description,
            }));
            return fetchedRestaurants;
        } catch (error: any) {
            throw error.response.data;
        }
    }
};

export default mainApi;