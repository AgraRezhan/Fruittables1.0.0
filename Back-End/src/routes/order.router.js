const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, create, getOrderById, cancelOrder } = require("../controllers/order.controller")

// /api/babs
router.get("/", validateToken, index);
router.get("/:orderId", validateToken, getOrderById);
router.post("/", validateToken, create);
router.post("/:orderId/cancel", validateToken, cancelOrder);


module.exports = router;