const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, getShippingByOrderId, update } = require("../controllers/shipping.controller")

// /api/babs
router.get("/", validateToken, index);
// router.get("/:id", validateToken, show);
router.get("/:orderId", validateToken, getShippingByOrderId);
// router.delete("/:productId", validateToken, remove);
router.put("/:orderId", validateToken, update);


module.exports = router;