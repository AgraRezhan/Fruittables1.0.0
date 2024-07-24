const { order: OrderModel, product: ProductModel, order_detail: OrderDetailModel, shipping: ShippingModel } = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

const index = async(req, res, next) => {
    try {
        const orders = await OrderModel.findAll({
            where: {
                user_id: req.user.id,
            },
            include: [{
                model: OrderDetailModel,
                as: "order_detail",
                include: [{
                    model: ProductModel,
                    as: "product",
                }],
            }],
        });

        const formattedOrders = orders.map((order) => {
            // Menghitung total quantity dari order_detail
            const totalQuantity = order.order_detail.reduce((acc, detail) => acc + detail.quantity, 0);

            return {
                id: order.id,
                order_date: order.order_date,
                address: order.address,
                status: order.status,
                quantity: totalQuantity, // Menyertakan total quantity dalam respons
                total: parseFloat(order.total),
                created_at: order.created_at,
                items: order.order_detail.map((detail) => ({
                    product_id: detail.product.id,
                    title: detail.product.title,
                    description: detail.product.description,
                    img_url: detail.product.img_url,
                    price: parseFloat(detail.product.price),
                    stock: detail.product.stock,
                    quantity: detail.quantity,
                })),
            };
        });

        return res.send({
            message: "Success",
            data: formattedOrders,
        });
    } catch (error) {
        next(error);
    }
};



/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

const create = async(req, res, next) => {
    const { items, shipping } = req.body;
    const currentUser = req.user;

    const idOrder = items.map((item) => item.product_id);

    if (idOrder.length === 0) {
        return res.status(400).send({ message: "Data tidak ditemukan" });
    }

    const products = await ProductModel.findAll({
        where: {
            id: idOrder,
        },
    });

    if (products.length !== idOrder.length) {
        return res.status(400).send({ message: "Satu atau lebih produk tidak ditemukan" });
    }

    const newOrder = await OrderModel.create({
        user_id: currentUser.id,
        order_date: new Date(),
        address: currentUser.address,
    });

    let totalPrice = 0;

    const orderDetails = items.map((item) => {
        const product = products.find((b) => b.id === item.product_id);
        const subtotal = product.price * item.quantity;
        totalPrice += subtotal;

        return {
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: product.price,
            subtotal: subtotal,
        };
    });

    await OrderDetailModel.bulkCreate(orderDetails);

    try {
        for (const item of items) {
            const product = products.find((b) => b.id === item.product_id);
            if (product) {
                product.stock -= item.quantity;
                product.sold += item.quantity;
                await product.save();
                console.log(`Updated product ${product.id}: sold=${product.sold}, stock=${product.stock}`);
            }
        }
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).send({ message: "Internal server error" });
    }

    await OrderModel.update({
        total: totalPrice,
        status: "pending",
    }, {
        where: {
            id: newOrder.id,
        },
    });

    const newShipping = await ShippingModel.create({
        user_id: currentUser.id,
        order_id: newOrder.id,
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        company_name: shipping.company_name,
        address: shipping.address,
        city: shipping.city,
        postcode: shipping.postcode,
        mobile: shipping.mobile,
        email: currentUser.email,
        img_payment: shipping.img_payment,
        note: shipping.note,
        payment_method: shipping.payment_method,
        total: shipping.total,
    });

    console.log("Shipping details:", newShipping);

    return res.send({
        message: "Success",
        data: {
            order_id: newOrder.id,
            total: totalPrice,
            items: orderDetails.map((od) => ({
                product_id: od.product_id,
                quantity: od.quantity,
                price: parseFloat(od.price),
                subtotal: parseFloat(od.subtotal),
            })),
            shipping: newShipping,
        },
    });
};


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const getOrderById = async(req, res, next) => {
    try {
        const { orderId } = req.params;

        // Temukan order berdasarkan orderId
        const order = await OrderModel.findByPk(orderId, {
            include: [{
                    model: OrderDetailModel,
                    as: "order_detail",
                    include: [{
                        model: ProductModel,
                        as: "product",
                    }],
                },
                {
                    model: ShippingModel,
                    as: "shipping",
                }
            ],
        });

        // Jika order tidak ditemukan
        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        // Format data order untuk dikembalikan
        const totalQuantity = order.order_detail.reduce((acc, detail) => acc + detail.quantity, 0);

        const formattedOrder = {
            id: order.id,
            order_date: order.order_date,
            address: order.address,
            status: order.status,
            quantity: totalQuantity,
            total: parseFloat(order.total),
            created_at: order.created_at,
            items: order.order_detail.map((detail) => ({
                product_id: detail.product.id,
                title: detail.product.title,
                description: detail.product.description,
                img_url: detail.product.img_url,
                price: parseFloat(detail.product.price),
                stock: detail.product.stock,
                quantity: detail.quantity,
            })),
            shipping: {
                first_name: order.shipping.first_name,
                last_name: order.shipping.last_name,
                company_name: order.shipping.company_name,
                address: order.shipping.address,
                city: order.shipping.city,
                postcode: order.shipping.postcode,
                mobile: order.shipping.mobile,
                email: order.shipping.email,
                img_payment: order.shipping.img_payment,
                note: order.shipping.note,
                payment_method: order.shipping.payment_method,
                total: order.shipping.total,
            }
        };

        return res.send({
            message: "Success",
            data: formattedOrder,
        });
    } catch (error) {
        next(error);
    }
};



const cancelOrder = async(req, res, next) => {
    const { orderId } = req.params;

    try {
        const order = await OrderModel.findByPk(orderId, {
            include: {
                model: OrderDetailModel,
                as: 'order_detail'
            }
        });

        if (!order) {
            return res.status(404).send({ message: "Orderan tidak ditemukan" });
        }

        console.log("Status awal order:", order.status);

        if (order.status === "cancelled") {
            return res.status(400).send({ message: "Orderan sudah dibatalkan" });
        }

        const orderDetails = order.order_detail;

        for (const detail of orderDetails) {
            const product = await ProductModel.findByPk(detail.product_id);

            if (!product) {
                return res.status(404).send({ message: `Produk dengan ID ${detail.product_id} tidak ditemukan` });
            }

            product.stock += detail.quantity;
            await product.save();
        }

        await OrderModel.update({ status: "cancelled" }, { where: { id: orderId } });

        // Periksa apakah pembaruan berhasil
        const updatedOrder = await OrderModel.findByPk(orderId);
        console.log("Status order setelah pembaruan:", updatedOrder.status);

        return res.send({ message: "Order cancelled successfully" });
    } catch (error) {
        next(error);
    }
};




/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const updateStatus = async(req, res, next) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await OrderModel.findByPk(orderId);

        if (!order) {
            return res.status(404).send({ message: "Order not found" });
        }

        await OrderModel.update({ status }, { where: { id: orderId } });

        return res.send({ message: "Order status updated successfully" });
    } catch (error) {
        next(error);
    }
};


module.exports = { index, create, getOrderById, cancelOrder, updateStatus };