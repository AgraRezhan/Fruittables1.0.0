const express = require("express");

const router = express.Router();

const { validateToken } = require("../middlewares/auth")
const { index, create, remove } = require("../controllers/cart.controller")

// /api/babs
router.get("/", validateToken, index);
router.post("/", validateToken, create);
router.delete("/:id", validateToken, remove);


module.exports = router;