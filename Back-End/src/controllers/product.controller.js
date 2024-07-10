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


        if (currentUser.role == "customer") {
            // Jika user adalah customer, tampilkan semua produk
            products = await ProductModel.findAll();
        } else if (currentUser.role == 'seller') {
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

const show = async(req, res, next) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findByPk(id, {
            attributes: ["id", "title", "description", "price", "stock", "img_url"]
        });

        if (!product) {
            return res.status(404).send({
                message: "product tidak ditemukan",
                data: null
            })
        }

        return res.send({
            message: "success",
            data: product,
        });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} _next
 */


const create = async(req, res, _next) => {
    try {
        const currentUser = req.user;

        if (!req.file) {
            return res.status(400).send({ message: "Gambar tidak ditemukan, pastikan gambar diunggah dengan benar" });
        }

        const image = req.file.path; // Cloudinary URL
        // console.log("Image ini:", image);
        // console.log("ini body", req.body)

        // Melakukan validasi terhadap user berdasarkan role
        if (currentUser.role !== 'seller') {
            return res.status(403).send({ message: "Hanya seller yang dapat menambahkan produk" });
        }

        const { title, description, price, stock, img_url } = req.body;

        // Memvalidasi inputan dari user
        if (!title || !description || !price || !stock) {
            return res.status(400).send({ message: "Permintaan tidak valid, pastikan semua data diisi" });
        }

        // Membuat produbaru
        const newProduct = await ProductModel.create({
            user_id: currentUser.id,
            title,
            description,
            price,
            stock,
            img_url: image,
            // img_url: image,
        });

        console.log("New product:", newProduct);

        return res.send({
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};


const update = async(req, res, _next) => {
    try {
        const currentUser = req.user;
        const { productId } = req.params;
        const image = req.file.path;
        const { title, description, price, stock, img_url } = req.body;


        // Memastikan productId tidak undefined
        if (!productId) {
            return res.status(400).send({ message: "Product ID tidak ditemukan" });
        }

        // Memastikan hanya seller yang dapat memperbarui produk
        if (currentUser.role !== 'seller') {
            return res.status(403).send({ message: "Hanya seller yang dapat memperbarui produk" });
        }

        // Memastikan produk milik seller yang sedang login
        const product = await ProductModel.findOne({
            where: {
                id: productId,
                user_id: currentUser.id,
            },
        });

        if (!product) {
            return res.status(404).send({ message: "Produk tidak ditemukan atau Anda tidak memiliki izin untuk memperbaruinya" });
        }

        // Memvalidasi inputan dari user
        if (!title && !description && !price && !stock && !img_url) {
            return res.status(400).send({ message: "Tidak ada data yang diperbarui" });
        }

        // Update produk
        const updatedProduct = await product.update({
            title: title,
            description: description,
            price: price,
            stock: stock,
            img_url: image,
        });

        return res.send({
            message: "Product updated successfully",
            data: updatedProduct,
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


module.exports = { index, show, create, remove, update };