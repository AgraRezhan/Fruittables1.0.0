import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    productItems: [],
    cartItems: [],

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
    }
}));

export default useProductStore;