const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, create, remove } = require("../controllers/product.controller")

// /api/babs
router.get("/", validateToken, index);
router.post("/", validateToken, create);
router.delete("/:productId", validateToken, remove);


module.exports = router;