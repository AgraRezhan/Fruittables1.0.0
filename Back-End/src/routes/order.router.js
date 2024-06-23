const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, create, cancelOrder } = require("../controllers/order.controller")

// /api/babs
router.get("/", validateToken, index);
router.post("/", validateToken, create);
router.post("/:orderId/cancel", validateToken, cancelOrder);


module.exports = router;