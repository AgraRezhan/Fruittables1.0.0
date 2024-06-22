const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, create, remove, update } = require("../controllers/product.controller")

// /api/babs
router.get("/", validateToken, index);
router.post("/", validateToken, create);
router.delete("/:productId", validateToken, remove);
router.put("/:productId", validateToken, update);


module.exports = router;