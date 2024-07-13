const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, create, update } = require("../controllers/shipping.controller")

// /api/babs
router.get("/", validateToken, index);
// router.get("/:id", validateToken, show);
router.post("/", validateToken, create);
// router.delete("/:productId", validateToken, remove);
router.put("/:shippingId", validateToken, update);


module.exports = router;