const express = require("express");

const router = express.Router();
const { storage } = require("../storage/storage");
const multer = require("multer");

const upload = multer(storage);

const { validateToken } = require("../middlewares/auth")
const { index, create, remove, update } = require("../controllers/product.controller")

// /api/babs
router.get("/", validateToken, index);
router.post("/", validateToken, upload.single("img_url"), create);
router.delete("/:productId", validateToken, remove);
router.put("/:productId", validateToken, upload.single("image"), update);


module.exports = router;