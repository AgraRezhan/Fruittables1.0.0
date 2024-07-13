import { create } from "zustand";

const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    setToken: (token) => {
        set({ token });
        localStorage.setItem('token', token); // Simpan token ke localStorage
    },
    clearToken: () => {
        set({ token: null });
        localStorage.removeItem('token'); // Hapus token dari localStorage
    },
    isAuthenticated: () => !!localStorage.getItem('token'), // Verifikasi autentikasi
}));
export default useAuthStore;