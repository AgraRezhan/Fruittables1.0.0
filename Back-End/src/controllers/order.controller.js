const { order: OrderModel, product: ProductModel, order_detail: OrderDetailModel } = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

const index = async(req, res, next) => {
    const orders = await OrderModel.findAll({
        where: {
            user_id: req.user.id,
        },
        include: [{
            model: OrderDetailModel,
            as: "order_detail",
            include: [{
                model: ProductModel,
                attributes: ["title"],
                as: "product",
            }, ],
        }, ],
    });

    return res.send({
        message: "Success",
        data: orders
            .map((order) => ({
                id: order.id,
                order_date: order.order_date,
                address: order.address,
                total: parseFloat(order.total),
                created_at: order.created_at,
                items: order.order_detail.map((detail) => ({
                    product_id: detail.product_id,
                    title: detail.title,
                    quantity: detail.quantity,
                    price: parseFloat(detail.price),
                    subtotal: parseFloat(detail.subtotal),
                })),
            })),
    });
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */


const create = async(req, res, next) => {
    const { items } = req.body;
    const currentUser = req.user;

    const newOrder = await OrderModel.create({
        user_id: currentUser.id,
        order_date: new Date(),
        address: currentUser.address,
    });

    const products = await ProductModel.findAll({
        where: {
            id: items.map((item) => item.product_id),
        },
    });

    let totalPrice = 0;

    //melakukan perhitungan terhadap subtotal order_detail
    const orderDetails = items.map((item) => {
        const product = products.find((b) => b.id === item.product_id);

        console.log("products", product)

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

    // Kurangi stok produk
    items.forEach(async(item) => {
        const product = products.find((b) => b.id === item.product_id);
        product.stock -= item.quantity;
        await product.save();
    });

    //melakukan update terhadap status dan total harga pada tabel order
    await OrderModel.update({
        total: totalPrice,
        status: "pending"
    }, {
        where: {
            id: newOrder.id,
        },
    });

    //mengembalikan hasil jika proses create order berhasil
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
        },
    });
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

        //melakukan pengecekan dengan orderan berdasarkan orderId
        if (!order) {
            return res.status(404).send({ message: "Orderan tidak ditemukan" });
        }

        //melakukan pengecekan terhadap status orderan
        if (order.status === "cancelled") {
            return res.status(400).send({ message: "Orderan sudah dibatalkan" });
        }

        const orderDetails = order.order_detail;

        //melakukan pengembalian jumlah produk yang telah dikurangi dari proses create order
        orderDetails.forEach(async(detail) => {
            const product = await ProductModel.findByPk(detail.product_id);
            product.stock += detail.quantity;
            await product.save();
        });

        await OrderModel.update({
            status: "cancelled"
        }, {
            where: {
                id: orderId,
            },
        });

        return res.send({ message: "Order cancelled successfully" });
    } catch (error) {
        next(error);
    }
};


module.exports = { index, create, cancelOrder };