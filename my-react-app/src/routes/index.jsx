import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/HomePage";
const Index = () => {
    const router = createBrowserRouter([{
        path: "/",
        element: < HomePage / > ,
    }, ]);

    return <RouterProvider router = { router }
    />;
};
export default Index;