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
  ]);

  return <RouterProvider router={router} />;
};

export default Index;
