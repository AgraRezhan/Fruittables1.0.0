const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, create } = require("../controllers/product.controller")

// /api/babs
router.get("/", validateToken, index);
router.post("/", validateToken, create);


module.exports = router;