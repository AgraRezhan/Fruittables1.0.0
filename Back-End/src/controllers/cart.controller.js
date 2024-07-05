const { cart: CartModel, product: ProductModel } = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

const index = async(req, res, _next) => {
    try {
        const cart = await CartModel.findAll({
            where: {
                user_id: req.user.id,
            },
            attributes: ["id", "product_id", "quantity"],
            include: [{
                model: ProductModel,
                as: 'product',
                attributes: ["id", "title", "description", "price", "stock", "img_url"],
            }]
        });

        return res.send({
            message: "Success",
            data: cart
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

        //melakukan pengecekan terhadapinputan user
        if (!product_id || !quantity) {
            return res.status(400).send({ message: "permintaan tidak valid" });
        }

        const product = await ProductModel.findOne({
            where: {
                id: product_id,
            },
        });

        //melakukan pengecekan produk dari product_id
        if (!product) {
            return res.status(404).send({ message: "Produk tidak ditemukan" });
        }

        //melakukan pengecekan pada stok produk
        if (product.stock < quantity) {
            return res.status(400).send({ message: "stock tidak mencukupi" });
        }

        const cart = await CartModel.create({
            user_id: req.user.id,
            product_id,
            quantity
        });

        // await ProductModel.update({
        //     stock: product.stock - quantity,
        // }, {
        //     where: {
        //         id: product_id,
        //     },
        // });

        return res.send({
            message: "Order created successfully",
            data: cart,
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

const remove = async(req, res, _next) => {
    try {
        const { id } = req.params;

        const cartItem = await CartModel.findOne({
            where: {
                id,
                user_id: req.user.id,
            },
        });

        //melakukan pengecekan terhadap produk yang akan di hapus dari 
        //cart berdasarkan id danuser_id dari tabel cart
        if (!cartItem) {
            return res.status(404).send({ message: "Cart item not found" });
        }

        //melakukan penghapusan data cart
        await CartModel.destroy({
            where: {
                id,
                user_id: req.user.id,
            },
        });

        return res.send({
            message: "Item removed from cart successfully",
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = { index, create, remove };