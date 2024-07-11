import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Shop from "../pages/Shop";
import DetailShop from "../pages/DetailShop";
const Index = () => {
    const router = createBrowserRouter([
        {
        path: "/",
        element: <Login /> ,
    },
    {
        path: "/home",
        element: <HomePage /> ,
    },
    {
        path: "/register",
        element: <Register /> ,
    },
    {
        path: "/cart",
        element: <Cart /> ,
    },
    {
        path: "/shop",
        element: <Shop /> ,
    },
    {
        path: "/detail",
        element: <DetailShop /> ,
    },
     ]);

    return <RouterProvider router = { router }
    />;
};
export default Index;