import CartItem from "@component/models/ICartItem";
import Cookies from "js-cookie";


class Cart {
    private items: Array<CartItem>;
    private restaurantId: number | null;

    constructor() {
        const tempCart = this.getCartItemsFromStorage();
        if (tempCart != null) {
            this.items = this.getCartItemsFromStorage().items || [];
            this.restaurantId = this.getCartItemsFromStorage().restaurantId || null;
        } else {
            this.items = [];
            this.restaurantId = null;
        }
    }

    addToCart(restaurantId: number, itemId: number) {
        if (restaurantId !== this.restaurantId) {
            this.items = [];
            this.restaurantId = restaurantId;
        }

        const existingIndex = this.items.findIndex((item) => item.itemId === itemId);
        console.log(existingIndex)
        if (existingIndex != null && existingIndex >= 0) {
            this.items[existingIndex].quantity++;
        } else {
            this.items.push({restaurantId, itemId, quantity: 1} as CartItem);
        }
        this.saveCartToStorage();
    }

    removeFromCart(itemId: number) {
        this.items = this.items.filter((cartItem) => cartItem.itemId !== itemId);
        this.saveCartToStorage();
    }

    getCartItems() {
        return this.items;
    }

    private saveCartToStorage() {
        Cookies.set('cart', JSON.stringify(this));
    }

    private getCartItemsFromStorage(): Cart {
        const cartData = Cookies.get('cart');
        return cartData ? JSON.parse(cartData) : null;
    }
}

const cart = new Cart();

export default cart;
