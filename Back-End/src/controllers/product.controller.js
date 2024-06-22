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

        //melakukan validasi terhadap user berdasarkan role
        if (currentUser.role !== 'seller') {
            return res.status(403).send({ message: "hanya seller yang dapat menambahkan produk" });
        }

        const { title, description, price, stock, img_url } = req.body;

        //memvalidasi inputan dari user
        if (!title || !description || !price || !stock || !img_url) {
            return res.status(400).send({ message: "permintaaan tidak valid" });
        }

        //create produbaru
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

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */

const remove = async(req, res, _next) => {
    try {
        const currentUser = req.user;
        const { productId } = req.params;

        console.log("id", productId)

        // Memastikan hanya seller yang dapat menghapus produk
        if (currentUser.role !== 'seller') {
            return res.status(403).send({ message: "Hanya seller yang dapat menghapus produk" });
        }

        const product = await ProductModel.findOne({
            where: {
                id: productId,
                user_id: currentUser.id, // Memastikan produk milik seller yang sedang login
            },
        });

        if (!product) {
            return res.status(404).send({ message: "Produk tidak ditemukan atau Anda tidak memiliki izin untuk menghapusnya" });
        }

        await ProductModel.destroy({
            where: {
                id: productId,
            },
        });

        return res.send({ message: "Produk berhasil dihapus" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};


module.exports = { index, create, remove };