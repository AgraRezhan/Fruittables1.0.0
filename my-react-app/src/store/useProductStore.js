import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    productItems: [],
    cartItems: [],
    orders: [],

    register: async(userData, navigate, setError) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', userData);
            const data = response.data;
            set({ user: data.user });
            localStorage.setItem('token', data.token);
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    },

    login: async(credentials, navigate, setError) => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', credentials);
            const data = response.data;
            set({ user: data.user });
            localStorage.setItem('token', data.data.token);
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Login failed. Please try again.');
            }
        }
    },

    logout: () => {
        set({ user: null });
        localStorage.removeItem('token');
    },

    fetchProducts: async() => {
        try {
            const token = get().token;
            if (!token) {
                console.error('Token not found. Unable to fetch products.');
                return;
            }

            const response = await axios.get('http://localhost:8000/api/products', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            set({ productItems: response.data.data });
            console.log("Fetched products successfully:", response.data.data);
        } catch (error) {
            console.error('Fetch products error:', error);
        }
    },

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
            console.log("itemId: ", itemId);
            console.log("Cart Items: ", get().cartItems);

            await axios.delete(`http://localhost:8000/api/carts/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedCartItems = get().cartItems.filter(item => item.id !== itemId);
            set({ cartItems: updatedCartItems });

            console.log("ini remove", itemId)

            console.log('Removed item from cart:', itemId);
        } catch (error) {
            console.error('Remove cart item error:', error);
        }
    },

    incrementCartItemQuantity: async(itemId) => {
        const token = get().token;
        if (!token) {
            console.error('Token not found. Unable to update item quantity.');
            return;
        }

        const cartItem = get().cartItems.find(item => item.id === itemId);
        if (!cartItem) {
            console.error('Cart item not found.');
            return;
        }

        const newQuantity = cartItem.quantity + 1;

        try {
            const response = await axios.put(`http://localhost:8000/api/carts/${itemId}`, {
                quantity: newQuantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedCartItem = response.data.data;

            set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === itemId ? {...item, quantity: newQuantity } : item
                ),
                productItems: state.productItems.map((p) =>
                    p.id === updatedCartItem.product_id ? {...p, stock: p.stock - 1 } : p
                )
            }));

            console.log('Incremented cart item quantity:', updatedCartItem);
        } catch (error) {
            console.error('Update cart item quantity error:', error);
        }
    },

    decrementCartItemQuantity: async(itemId) => {
        const token = get().token;
        if (!token) {
            console.error('Token not found. Unable to update item quantity.');
            return;
        }

        const cartItem = get().cartItems.find(item => item.id === itemId);
        if (!cartItem) {
            console.error('Cart item not found.');
            return;
        }

        if (cartItem.quantity <= 1) {
            console.error('Quantity must be greater than 0.');
            return;
        }

        const newQuantity = cartItem.quantity - 1;

        try {
            const response = await axios.put(`http://localhost:8000/api/carts/${itemId}`, {
                quantity: newQuantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const updatedCartItem = response.data.data;

            set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === itemId ? {...item, quantity: newQuantity } : item
                ),
                productItems: state.productItems.map((p) =>
                    p.id === updatedCartItem.product_id ? {...p, stock: p.stock + 1 } : p
                )
            }));

            console.log('Decremented cart item quantity:', updatedCartItem);
        } catch (error) {
            console.error('Update cart item quantity error:', error);
        }
    },

    createOrder: async(orderData, navigate, setError) => {
        const token = get().token;
        if (!token) {
            console.error('Token not found. Unable to create order.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/orders', orderData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const newOrder = response.data;

            // Update orders in the state
            set(state => ({
                orders: [...state.orders, newOrder],
                cartItems: [] // Clear the cart after successful order creation
            }));

            // Redirect to order success page
            navigate('/shop');
        } catch (error) {
            console.error('Create order error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Order creation failed. Please try again.');
            }
        }
    }

}));

export default useProductStore;