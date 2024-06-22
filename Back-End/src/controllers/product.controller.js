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
            return res.status(403).send({ message: "Forbidden: Invalid role" });
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

module.exports = { index };