const { product: ProductModel } = require("../models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

const index = async(req, res, _next) => {
    try {
        const currentUser = req.user;
        let products;


        if (currentUser.role === 'customer') {
            // Jika user adalah customer, tampilkan semua produk
            products = await ProductModel.findAll();
        } else if (currentUser.role === 'seller') {
            // Jika user adalah seller, tampilkan produk berdasarkan user_id
            products = await ProductModel.findAll({
                where: {
                    user_id: currentUser.id,
                },
            });
        } else {
            return res.status(403).send({ message: "role tidak valid" });
        }

        return res.send({
            message: "Success",
            data: products,
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
        const currentUser = req.user;

        if (currentUser.role !== 'seller') {
            return res.status(403).send({ message: "hanya seller yang dapat menambahkan produk" });
        }

        const { title, description, price, stock, img_url } = req.body;

        // Validasi input
        if (!title || !description || !price || !stock || !img_url) {
            return res.status(400).send({ message: "permintaaan tidak valid" });
        }

        const newProduct = await ProductModel.create({
            user_id: currentUser.id,
            title,
            description,
            price,
            stock,
            img_url,
        });

        return res.send({
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = { index, create };