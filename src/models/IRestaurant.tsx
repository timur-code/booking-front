interface IRestaurant {
    id: number;
    name: string;
    description: string;
    location: string;
    timeOpen: string;
    timeClosed: string;
    seats: number;
    image: string;
}

export default IRestaurant;