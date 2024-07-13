const { shipping: ShippingModel, user: UserModel, order: OrderModel } = require("../models");

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
            // Jika user adalah customer, tampilkan semua produk
            shippings = await ShippingModel.findAll({
                include: [{
                    model: UserModel,
                    as: "user",
                    include: [{
                        model: OrderModel,
                        as: "order",
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


const create = async(req, res, _next) => {
    try {
        const currentUser = req.user;
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
            total,
        } = req.body;

        // Validasi input
        if (!first_name ||
            !last_name ||
            !address ||
            !city ||
            !postcode ||
            !mobile ||
            !email ||
            !payment_method ||
            !total
        ) {
            return res.status(400).send({ message: "Permintaan tidak valid, pastikan semua data diisi" });
        }

        // Dapatkan atau buat order terlebih dahulu
        const newOrder = await OrderModel.create({
            user_id: currentUser.id,
            total,
            // Tambahkan atribut lain yang diperlukan untuk Order
        });

        const order_id = newOrder.id;

        // Buat shipping baru
        const newShipping = await ShippingModel.create({
            user_id: currentUser.id,
            order_id,
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
            total,
        });

        return res.send({
            message: "Shipping created successfully",
            data: newShipping,
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

const update = async(req, res, _next) => {
    try {
        const currentUser = req.user;
        const { shippingId } = req.params;
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
        if (!shippingId) {
            return res.status(400).send({ message: "Shipping ID tidak ditemukan" });
        }

        // Pastikan shipping milik user yang sedang login
        const shipping = await ShippingModel.findOne({
            where: {
                id: shippingId,
                user_id: currentUser.id,
            },
        });

        if (!shipping) {
            return res.status(404).send({ message: "Shipping tidak ditemukan atau Anda tidak memiliki izin untuk memperbaruinya" });
        }

        // Hitung total dari cartItems jika diberikan
        let total;
        if (cartItems) {
            total = cartItems.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
        }

        // Dapatkan order_id dari shipping yang ada
        const order_id = shipping.order_id;

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
            total: total || shipping.total,
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



module.exports = { index, create, update };