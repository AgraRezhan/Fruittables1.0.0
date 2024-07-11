import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register"
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
     ]);

    return <RouterProvider router = { router }
    />;
};
export default Index;