interface IBooking {
    restaurantId: number,
    timeStart: string, // You can set an initial value if needed
    preorder: Array<number>
}

export default IBooking;