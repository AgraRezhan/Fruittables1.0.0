import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import Shop from '../pages/Shop';
import DetailShop from '../pages/DetailShop';
import Checkout from '../pages/Checkout';
import OrderDetail from "../pages/OrderDetail";
import ProtectedRoute from '../store/ProtectedRoute';
import UpdateBilling from "../pages/Update";
import ListProduct from "../pages/ListProduct";
import UpdateProduct from "../pages/UpdateProduct";
import AddProduct from "../pages/Add";
import Invoice from "../pages/Invoice";

const Index = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: 
          <HomePage />
      
    },{
      path: '/login',
      element: <Login />,
    },
    
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/cart',
      element: (
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      ),
    },
    {
      path: '/shop',
      element: (
        <ProtectedRoute>
          <Shop />
        </ProtectedRoute>
      ),
    },
    {
      path: '/detail/:id',
      element: (
        <ProtectedRoute>
          <DetailShop />
        </ProtectedRoute>
      ),
    },
    {
      path: '/checkout',
      element: (
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      ),
    },
    {
      path: '/orderdetail/:id',
      element: (
        <ProtectedRoute>
          <OrderDetail />
        </ProtectedRoute>
      ),
    },
    {
      path: '/update/:id',
      element: (
        <ProtectedRoute>
          <UpdateBilling />
        </ProtectedRoute>
      ),
    },
    {
      path: '/listproduct',
      element: (
        <ProtectedRoute>
          <ListProduct />
        </ProtectedRoute>
      ),
    },
    {
      path: '/updateproduct/:id',
      element: (
        <ProtectedRoute>
          <UpdateProduct />
        </ProtectedRoute>
      ),
    },
    {
      path: '/addproduct',
      element: (
        <ProtectedRoute>
          <AddProduct />
        </ProtectedRoute>
      ),
    },
    {
      path: '/invoice',
      element: (
        <ProtectedRoute>
          <Invoice />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Index;
