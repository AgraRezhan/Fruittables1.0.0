const { order: OrderModel, product: ProductModel } = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

const index = async(req, res, _next) => {
    try {
        const orders = await OrderModel.findAll({
            where: {
                user_id: req.user.id,
            },
            attributes: ["id", "quantity", "total_price", "status"],
            include: [{
                model: ProductModel,
                as: 'product',
                attributes: ["id", "title", "description", "price", "stock", "img_url"],
            }]
        });

        return res.send({
            message: "Success",
            data: orders
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

const create = async(req, res, _next) => {
    try {
        const { product_id, quantity } = req.body;

        if (!product_id || !quantity) {
            return res.status(400).send({ message: "permintaan tidak valid" });
        }

        const product = await ProductModel.findOne({
            where: {
                id: product_id,
            },
        });

        if (!product) {
            return res.status(404).send({ message: "Produk tidak ditemukan" });
        }

        if (product.stock < quantity) {
            return res.status(400).send({ message: "stock tidak mencukupi" });
        }

        const order = await OrderModel.create({
            user_id: req.user.id,
            product_id,
            quantity,
            total_price: product.price * quantity,
            status: "sedang diproses",
        });

        await ProductModel.update({
            stock: product.stock - quantity,
        }, {
            where: {
                id: product_id,
            },
        });

        return res.send({
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = { index, create };