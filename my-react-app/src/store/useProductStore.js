import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set, get) => ({
    token: localStorage.getItem('token') || null,
    productItems: [],


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

}));

export default useProductStore;