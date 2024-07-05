const express = require("express");

const router = express.Router();
const { storage } = require("../storage/storage");
const multer = require("multer");

const upload = multer(storage);

const { validateToken } = require("../middlewares/auth")
const { index, show, create, remove, update } = require("../controllers/product.controller")

// /api/babs
router.get("/", validateToken, index);
<<<<<<< HEAD
router.post("/", validateToken, upload.single("img_url"), create);
=======
router.get("/:id", validateToken, show);
router.post("/", validateToken, create);
>>>>>>> 0cd85ec3db4f7663dd2ed8876620ad270d9aef40
router.delete("/:productId", validateToken, remove);
router.put("/:productId", validateToken, upload.single("image"), update);


module.exports = router;