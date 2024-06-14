"use strict";

const {
    user,
    product,
    cart,
    order,
} = require("../../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    /**
     * @param {import('sequelize').QueryInterface} queryInterface
     * @param {import('sequelize').Sequelize} _Sequelize
     */
    async up(queryInterface, _Sequelize) {
        await user.destroy({ truncate: true });
        await product.destroy({ truncate: true });
        await cart.destroy({ truncate: true });
        await order.destroy({ truncate: true });

        await queryInterface.bulkInsert("users", [
            { id: 1, username: "JohnDoe", first_name: "John", last_name: "Doe", email: "johndoe@gmail.com", password: "$2a$12$.HOb8SlLxGN4usHDihNaQe6IFDodXO09pO6Nfi.M96XzcTJ9F1HDu", address: "Jl. Mawar No.3, Bantaeng, Sulawesi Selatan", role: "customer" },
            { id: 2, username: "ErdianFernando", first_name: "Erdian", last_name: "Fernando", email: "erdianfernando@gmail.com", password: "$2a$12$.HOb8SlLxGN4usHDihNaQe6IFDodXO09pO6Nfi.M96XzcTJ9F1HDu", address: "Jl. Mawar No.3, Bantaeng, Sulawesi Selatan", role: "seller" },
        ]);

        await queryInterface.bulkInsert("products", [
            { id: 1, user_id: 2, title: "Apel", description: "Apel termasuk buah sehat yang bisa dikonsumsi saat diet ketat.Buah ini mengandung banyak serat sehingga bisa membuat Anda kenyang tahan lama.", stock: 100, price: 10000, img_url: "https://cdn.hellosehat.com/wp-content/uploads/2021/03/736e32fa-buah-sehat-apel-650x434.jpg" },
            { id: 2, user_id: 2, title: "Nanas", description: "Nanas adalah salah satu buah tropis yang banyak disukai karena razanya yang lezat dan dapat disajikan ke dala, berbagai bentuk makanan dan minuman.", stock: 50, price: 25000, img_url: "https://cdn.hellosehat.com/2016/09/561e14d7-shutterstock_572083087.jpg" },
            { id: 3, user_id: 2, title: "Delima", description: "Bukan cuma teh hijau memiliki senyawa dengan antioksidan yang tinggi, delima pun demikian.", stock: 100, price: 5000, img_url: "https://cdn.hellosehat.com/wp-content/uploads/2021/03/47cb96b3-buah-sehat-delima-650x434.jpg" },
            { id: 4, user_id: 2, title: "Semangka", description: "Semangka adalah buah sehat yang kaya air. Dalam 100 gram semangka, kandungan airnya sebesar 91,4 gram. Artinya, sebanyak lebih dari 91% kandungan semangka terdiri dari air.", stock: 50, price: 35000, img_url: "https://cdn.hellosehat.com/wp-content/uploads/2017/05/Manfaat-Baik-Dari-Buah-Semangka-untuk-Tubuh.jpg" },
            { id: 5, user_id: 2, title: "Stroberi", description: "Buah ini memang kecil, tetapi besar manfaatnya untuk kesehatan tubuh. Dalam 100 gram, ada 56 mg vitamin C yang terkandung.", stock: 50, price: 35000, img_url: "https://cdn.hellosehat.com/wp-content/uploads/2021/03/41e3a6bc-buah-sehat-stroberi-650x434.jpg" },
        ]);

        await queryInterface.bulkInsert("carts", [
            { id: 1, user_id: 1, product_id: 1, quantity: 10 },
            { id: 2, user_id: 1, product_id: 1, quantity: 10 },
            { id: 3, user_id: 1, product_id: 1, quantity: 10 },
        ]);

        await queryInterface.bulkInsert("orders", [
            { id: 1, user_id: 1, product_id: 1, quantity: 10, total_price: 100000, status: "sedang diproses" },
            { id: 2, user_id: 1, product_id: 1, quantity: 10, total_price: 250000, status: "sedang diproses" },
            { id: 3, user_id: 1, product_id: 1, quantity: 10, total_price: 50000, status: "sedang diproses" },
        ]);

    },
    /**
     * @param {import('sequelize').QueryInterface} _queryInterface
     * @param {import('sequelize').Sequelize} _Sequelize
     */
    async down(_queryInterface, _Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};