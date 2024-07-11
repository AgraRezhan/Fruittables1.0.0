import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set, get) => ({
    token: localStorage.getItem('token') || null,
    cartItems: [],

    fetchCarts: async() => {
        try {
            const token = get().token;
            if (!token) {
                console.error('Token not found. Unable to fetch products.');
                return;
            }

            const response = await axios.get('http://localhost:8000/api/carts', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ cartItems: response.data.data });
            console.log("Fetched carts successfully:", response.data.data);
        } catch (error) {
            console.error('Fetch carts error:', error);
        }
    },

    addCartItem: async(item) => {
        if (!item || !item.id) {
            console.error('Invalid product item:', item);
            return;
        }

        console.log('Adding item to cart:', item);

        const token = get().token;
        if (!token) {
            console.error('Token not found. Unable to add item to cart.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/carts', { product_id: item.id, quantity: 1 }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const updatedCartItems = response.data.data;
            set({ cartItems: updatedCartItems });

            set((state) => ({
                productItems: state.productItems.map((p) =>
                    p.id === item.id ? {...p, stock: p.stock - 1 } : p
                ),
            }));
            console.log('Updated cart items:', updatedCartItems);
        } catch (error) {
            console.error('Add cart item error:', error);
        }
    },

    removeCartItem: async(itemId) => {
        const token = get().token;
        if (!token) {
            console.error('Token not found. Unable to remove item from cart.');
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/carts/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedCartItems = get().cartItems.filter(item => item.id !== itemId);
            set({ cartItems: updatedCartItems });

            console.log('Removed item from cart:', itemId);
        } catch (error) {
            console.error('Remove cart item error:', error);
        }
    }
}));

export default useProductStore;