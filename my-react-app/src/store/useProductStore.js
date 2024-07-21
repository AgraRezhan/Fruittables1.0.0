import { create } from "zustand";
import axios from "axios";

const useProductStore = create((set, get) => ({
    user: null,
    token: localStorage.getItem("token") || null,
    productItems: [],
    productDesc: [],
    cartItems: [],
    orders: [],
    shippings: [],
    errorMessage: '',

    setErrorMessage: (message) => set({ errorMessage: message }),

    register: async(userData, navigate, setError) => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/register",
                userData
            );
            const data = response.data;
            set({ user: data.data });
            localStorage.setItem("token", data.token);
            console.log("ini register", data.message); // Menampilkan pesan sukses

            if (data.message === "Password is too weak") {
                set({ errorMessage: "Password is too weak" });
            } else
            // if (data.message === "User successfully registered")
            {
                // set({ errorMessage: '' });
                set({ errorMessage: "Login success" });
                navigate("/login")

            }

        } catch (error) {
            console.error("Registration error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                set({ errorMessage: error.response.data.message }); // Mengambil pesan error dari response
                setError(error.response.data.message);
            } else {
                set({ errorMessage: "Registration failed. Please try again." }); // Pesan default jika tidak ada pesan error dari response
            }
        }
    },
    login: async(credentials, navigate, setError) => {
        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/login",
                credentials
            );
            const data = response.data;
            set({ user: data.data.data });
            localStorage.setItem("token", data.data.token);

            console.log("user", data.data.data)
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            } else {
                setError("Login failed. Please try again.");
            }
        }
    },

    logout: () => {
        set({ user: null });
        localStorage.removeItem("token");
    },

    fetchProducts: async() => {
        try {
            // const token = get().token;
            // if (!token) {
            //     console.error("Token not found. Unable to fetch products.");
            //     return;
            // }

            const response = await axios.get("http://localhost:8000/api/products",
                //     {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // }
            );
            set({ productItems: response.data.data });
            console.log("Fetched products successfully:", response.data.data);
        } catch (error) {
            console.error("Fetch products error:", error);
        }
    },
    fetchProductDescs: async() => {
        try {
            // const token = get().token;
            // if (!token) {
            //     console.error("Token not found. Unable to fetch products.");
            //     return;
            // }

            const response = await axios.get("http://localhost:8000/api/products/desc",
                // {
                // headers: {
                //     Authorization: `Bearer ${token}`,
                // },
                // }
            );
            set({ productDesc: response.data.data });
            console.log("Fetched products successfully:", response.data.data);
        } catch (error) {
            console.error("Fetch products error:", error);
        }
    },

    fetchCarts: async() => {
        try {
            const token = get().token;
            if (!token) {
                console.error("Token not found. Unable to fetch products.");
                return;
            }

            const response = await axios.get("http://localhost:8000/api/carts", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ cartItems: response.data.data });
            console.log("Fetched carts successfully:", response.data.data);
        } catch (error) {
            console.error("Fetch carts error:", error);
        }
    },

    addCartItem: async(item) => {
        if (!item || !item.id) {
            console.error("Invalid product item:", item);
            return;
        }

        console.log("Adding item to cart:", item);

        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to add item to cart.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/carts", {
                    product_id: item.id,
                    quantity: 1
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const updatedCartItems = response.data.data;
            set({ cartItems: updatedCartItems });

            set((state) => ({
                productItems: state.productItems.map((p) =>
                    p.id === item.id ? {...p, stock: p.stock - 1 } : p //mengurangi langsung stock
                    // p.id === item.id ? {...p } : p
                ),
            }));
            console.log("Updated cart items:", updatedCartItems);
        } catch (error) {
            console.error("Add cart item error:", error);
        }
    },

    removeCartItem: async(itemId) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to remove item from cart.");
            return;
        }

        try {
            console.log("itemId: ", itemId);
            console.log("Cart Items: ", get().cartItems);

            await axios.delete(`http://localhost:8000/api/carts/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedCartItems = get().cartItems.filter(
                (item) => item.id !== itemId
            );
            set({ cartItems: updatedCartItems });

            console.log("ini remove", itemId);

            console.log("Removed item from cart:", itemId);
        } catch (error) {
            console.error("Remove cart item error:", error);
        }
    },

    incrementCartItemQuantity: async(itemId) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to update item quantity.");
            return;
        }

        const cartItem = get().cartItems.find((item) => item.id === itemId);
        if (!cartItem) {
            console.error("Cart item not found.");
            return;
        }

        const newQuantity = cartItem.quantity + 1;

        try {
            const response = await axios.put(
                `http://localhost:8000/api/carts/${itemId}`, {
                    quantity: newQuantity,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedCartItem = response.data.data;

            set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === itemId ? {...item, quantity: newQuantity } : item
                ),
                productItems: state.productItems.map((p) =>
                    p.id === updatedCartItem.product_id ? {...p, stock: p.stock - 1 } : p
                ),
            }));

            console.log("Incremented cart item quantity:", updatedCartItem);
        } catch (error) {
            alert("Cek kembali ketersediaan produk")
            console.error("Update cart item quantity error:", error);
        }
    },

    decrementCartItemQuantity: async(itemId) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to update item quantity.");
            return;
        }

        const cartItem = get().cartItems.find((item) => item.id === itemId);
        if (!cartItem) {
            console.error("Cart item not found.");
            return;
        }

        if (cartItem.quantity <= 1) {
            console.error("Quantity must be greater than 0.");
            alert("Quantity must be greater than 0.")
            return;
        }

        const newQuantity = cartItem.quantity - 1;

        try {
            const response = await axios.put(
                `http://localhost:8000/api/carts/${itemId}`, {
                    quantity: newQuantity,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedCartItem = response.data.data;

            set((state) => ({
                cartItems: state.cartItems.map((item) =>
                    item.id === itemId ? {...item, quantity: newQuantity } : item
                ),
                productItems: state.productItems.map((p) =>
                    p.id === updatedCartItem.product_id ? {...p, stock: p.stock + 1 } : p
                ),
            }));

            console.log("Decremented cart item quantity:", updatedCartItem);
        } catch (error) {
            alert("Cek kembali ketersediaan produk")
            console.error("Update cart item quantity error:", error);
        }
    },


    createOrder: async(orderData, setError) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to create order.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/orders", {
                    ...orderData,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const newOrder = response.data;

            set((state) => ({
                orders: [...state.orders, newOrder],
                cartItems: [], // Clear the cart after successful order creation
            }));

            // navigate('/shop'); // Navigate to order success page

        } catch (error) {
            console.error("Create order error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Order creation failed. Please try again.");
            }
        }
    },
    fetchOrder: async() => {
        try {
            const token = get().token;
            if (!token) {
                console.error("Token not found. Unable to fetch products.");
                return;
            }

            const response = await axios.get("http://localhost:8000/api/orders", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ orders: response.data.data });
            console.log("Fetched carts successfully:", response.data.data);
        } catch (error) {
            console.error("Fetch carts error:", error);
        }
    },

    fetchOrderById: async(orderId) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to fetch order.");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data; // Pastikan data dikembalikan dengan benar
        } catch (error) {
            console.error("Fetch order error:", error);
            throw error; // Pastikan error dilemparkan untuk ditangani di komponen
        }
    },


    createShipping: async(shippingData, navigate, setError) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to create shipping.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/shippings",
                shippingData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const newShipping = response.data.data;

            set((state) => ({
                shippings: [...state.shippings, newShipping],
            }));

            // Optional: navigate to a success page
            if (navigate) {
                navigate("/shop");
            }
        } catch (error) {
            console.error("Create shipping error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Shipping creation failed. Please try again.");
            }
        }
    },

    fetchShippingByOrderId: async(orderId, setError) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to fetch shipping.");
            setError("Token not found. Unable to fetch shipping.");
            return null;
        }

        try {
            const response = await axios.get(
                `http://localhost:8000/api/shippings/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.data) {
                const shipping = response.data.data;
                // console.log("Fetched shipping data:", shipping); // Tambahkan log ini
                set((state) => ({
                    shippings: [...state.shippings, shipping],
                }));
                return shipping;
            } else {
                setError("Shipping not found for this order.");
                return null;
            }
        } catch (error) {
            console.error("Fetch shipping error:", error);
            if (error.response && error.response.status === 404) {
                setError("Shipping not found for this order.");
            } else if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Shipping fetch failed. Please try again.");
            }
            return null;
        }
    },

    updateShipping: async(orderId, shippingData, setError) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to update shipping.");
            setError("Token not found. Unable to update shipping.");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8000/api/shippings/${orderId}`,
                shippingData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.data) {
                const updatedShipping = response.data.data;
                set((state) => ({
                    shippings: state.shippings.map((shipping) =>
                        shipping.id === orderId ? updatedShipping : shipping
                    ),
                }));
            } else {
                setError("Shipping update failed.");
            }
        } catch (error) {
            console.error("Update shipping error:", error);
            if (error.response && error.response.status === 404) {
                setError("Shipping not found for this order.");
            } else if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Shipping update failed. Please try again.");
            }
        }
    },

    setOrders: (orders) => set({ orders }),


    cancelOrder: async(orderId, setError) => {
        const token = get().token;
        if (!token) {
            console.error("Token not found. Unable to cancel order.");
            setError("Token not found. Unable to cancel order.");
            return;
        }
        console.log("order id ini", orderId);
        try {
            const response = await axios.post(
                `http://localhost:8000/api/orders/${orderId}/cancel`,
                null, // No body payload required for cancellation
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Cancel order response:", response.data);
            return response.data; // You may return additional data if needed
        } catch (error) {
            console.error("Cancel order error:", error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            } else {
                setError("Failed to cancel order. Please try again.");
            }
            throw error; // Re-throw error to handle in caller function
        }
    },
}));

export default useProductStore;