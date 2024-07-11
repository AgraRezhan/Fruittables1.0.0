import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem('token') || null,


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


}));

export default useProductStore;