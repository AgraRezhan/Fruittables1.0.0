import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Cart from '../pages/Cart';
import Shop from '../pages/Shop';
import DetailShop from '../pages/DetailShop';
import Checkout from '../pages/Checkout';
import ProtectedRoute from '../store/ProtectedRoute';

const Index = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/home',
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
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
  ]);

  return <RouterProvider router={router} />;
};

export default Index;
