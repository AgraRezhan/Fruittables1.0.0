import { create } from "zustand";
import axios from "axios";

const useProductStore = create(
    (set, get) => ({
        user: null,
        token: localStorage.getItem('token') || null,
        productItems: [],
        cartItemss: [],
        // Fungsi untuk mendaftarkan pengguna baru
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
                console.log("ini bagian dari token", data.data.token)
            } catch (error) {
                console.error('Login error:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Registration failed. Please try again.');
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
        }


    })
);

export default useProductStore;