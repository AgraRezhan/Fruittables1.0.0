import { useNavigate } from "react-router-dom";
import useAuthStore from "./useAuthStore";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Arahkan ke halaman login jika tidak terautentikasi
        }
    }, [isAuthenticated, navigate]);

    if (!isAuthenticated) {
        return null; // Atau tampilkan pesan atau komponen loading jika perlu
    }

    return children;
};

export default ProtectedRoute;