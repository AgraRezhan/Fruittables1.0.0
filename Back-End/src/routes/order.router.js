const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, create, getOrderById, cancelOrder, updateStatus } = require("../controllers/order.controller")

// /api/babs
router.get("/", validateToken, index);
router.get("/:orderId", validateToken, getOrderById);
router.put("/:orderId/status", validateToken, updateStatus);
router.post("/", validateToken, create);
router.put("/:orderId/cancel", validateToken, cancelOrder);


module.exports = router;