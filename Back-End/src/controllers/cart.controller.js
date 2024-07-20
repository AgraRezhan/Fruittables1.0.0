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

        // melakukan pengecekan terhadap inputan user
        if (!product_id || !quantity) {
            return res.status(400).send({ message: "Permintaan tidak valid" });
        }

        const product = await ProductModel.findOne({
            where: {
                id: product_id,
            },
        });

        // melakukan pengecekan produk dari product_id
        if (!product) {
            return res.status(404).send({ message: "Produk tidak ditemukan" });
        }

        // melakukan pengecekan pada stok produk
        if (product.stock < quantity) {
            return res.status(400).send({ message: "Stock tidak mencukupi" });
        }

        // cek apakah item sudah ada di cart
        const existingCartItem = await CartModel.findOne({
            where: {
                user_id: req.user.id,
                product_id,
            },
        });

        let cart;

        if (existingCartItem) {
            // jika item sudah ada di cart, update quantity
            const newQuantity = existingCartItem.quantity + quantity;

            // cek stok produk sebelum update
            if (product.stock < newQuantity) {
                return res.status(400).send({ message: "Stock tidak mencukupi untuk quantity yang diminta" });
            }

            await existingCartItem.update({ quantity: newQuantity });

            cart = existingCartItem;
        } else {
            // jika item belum ada di cart, tambahkan item baru ke cart
            cart = await CartModel.create({
                user_id: req.user.id,
                product_id,
                quantity,
            });
        }

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

        //melakukan pengecekan terhadap produk yang akan dihapus dari cart berdasarkan id dan user_id dari tabel cart
        if (!cartItem) {
            return res.status(404).send({ message: "Cart item not found" });
        }

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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */
const update = async(req, res, _next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).send({ message: "Quantity must be greater than 0" });
        }

        const cartItem = await CartModel.findOne({
            where: {
                id,
                user_id: req.user.id,
            },
        });

        if (!cartItem) {
            return res.status(404).send({ message: "Cart item not found" });
        }

        const product = await ProductModel.findOne({
            where: {
                id: cartItem.product_id,
            },
        });

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        //cek stok produk sebelum update
        const stockDifference = quantity - cartItem.quantity;
        if (product.stock < stockDifference) {
            return res.status(400).send({ message: "Stock tidak mencukupi untuk quantity yang diminta" });
        }

        await cartItem.update({ quantity });

        //update stok produk
        // await product.update({
        //     stock: product.stock - stockDifference,
        // });

        return res.send({
            message: "Cart item updated successfully",
            data: cartItem,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = { index, create, remove, update };