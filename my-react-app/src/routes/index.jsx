import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Shop from "../pages/Shop";
const Index = () => {
    const router = createBrowserRouter([
        {
        path: "/",
        element: <HomePage /> ,
    },
    {
        path: "/login",
        element: <Login /> ,
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
     ]);

    return <RouterProvider router = { router }
    />;
};
export default Index;