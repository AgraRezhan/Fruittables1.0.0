const { shipping: ShippingModel, user: UserModel, order: OrderModel, product: ProductModel, order_detail: OrderDetailModel, } = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

const index = async(req, res, _next) => {
    try {
        const currentUser = req.user;
        let shippings;

        if (currentUser.role === "customer") {
            // Jika user adalah customer, tampilkan semua produk terkait dengan pengiriman
            shippings = await ShippingModel.findAll({
                where: {
                    user_id: currentUser.id,
                },
                include: [{
                    model: UserModel,
                    as: "user",
                    include: [{
                        model: OrderModel,
                        as: "order",
                        include: [{
                            model: OrderDetailModel,
                            as: "order_detail",
                            include: [{
                                model: ProductModel,
                                as: "product",

                            }, ],
                        }, ],
                    }, ],
                }, ],
            });
        } else if (currentUser.role === "seller") {
            // Jika user adalah seller, tampilkan produk berdasarkan user_id
            shippings = await ShippingModel.findAll({
                where: {
                    user_id: currentUser.id,
                },
                include: [{
                    model: UserModel,
                    as: "user",
                    include: [{
                        model: OrderModel,
                        as: "order",
                        include: [{
                            model: ProductModel,
                            as: "product",
                        }, ],
                    }, ],
                }, ],
            });
        } else {
            return res.status(403).send({ message: "role tidak valid" });
        }

        return res.send({
            message: "Success",
            data: shippings,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */
const getShippingByOrderId = async(req, res, _next) => {
    try {
        const { orderId } = req.params;

        // Validasi input
        if (!orderId) {
            return res.status(400).send({ message: "Order ID tidak ditemukan" });
        }

        // Cari shipping berdasarkan orderId
        const shipping = await ShippingModel.findOne({
            where: {
                order_id: orderId,
            },
            include: [{
                model: UserModel,
                as: "user",
            }, {
                model: OrderModel,
                as: "order",
                include: [{
                    model: OrderDetailModel,
                    as: "order_detail",
                    include: [{
                        model: ProductModel,
                        as: "product",
                    }],
                }],
            }],
        });

        if (!shipping) {
            return res.status(404).send({ message: "Shipping tidak ditemukan" });
        }

        return res.send({
            message: "Success",
            data: shipping,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */


const update = async(req, res, _next) => {
    try {
        const currentUser = req.user;
        const { orderId } = req.params;
        const {
            first_name,
            last_name,
            company_name,
            address,
            city,
            postcode,
            mobile,
            email,
            note,
            payment_method,
            cartItems,
        } = req.body;

        // Validasi input
        if (!orderId) {
            return res.status(400).send({ message: "Order ID tidak ditemukan" });
        }

        // Temukan order dan pastikan milik user yang sedang login
        const order = await OrderModel.findOne({
            where: {
                id: orderId,
                user_id: currentUser.id,
            },
        });

        if (!order) {
            return res.status(404).send({ message: "Order tidak ditemukan atau Anda tidak memiliki izin untuk memperbaruinya" });
        }

        // Temukan shipping terkait dengan order
        const shipping = await ShippingModel.findOne({
            where: {
                order_id: orderId,
            },
        });

        if (!shipping) {
            return res.status(404).send({ message: "Shipping tidak ditemukan untuk order ini" });
        }

        // Hitung total dari cartItems jika diberikan
        let total = shipping.total;
        if (cartItems) {
            total = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
        }

        // Update shipping
        const updatedShipping = await shipping.update({
            first_name: first_name || shipping.first_name,
            last_name: last_name || shipping.last_name,
            company_name: company_name || shipping.company_name,
            address: address || shipping.address,
            city: city || shipping.city,
            postcode: postcode || shipping.postcode,
            mobile: mobile || shipping.mobile,
            email: email || shipping.email,
            note: note || shipping.note,
            payment_method: payment_method || shipping.payment_method,
            total: total,
        });

        return res.send({
            message: "Shipping updated successfully",
            data: updatedShipping,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};




module.exports = { index, getShippingByOrderId, update };