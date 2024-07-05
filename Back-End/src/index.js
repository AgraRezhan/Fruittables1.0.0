const path = require("path");

// require("dotenv").config({ path: path.join(__dirname, "../.env") });
require('dotenv').config()

const express = require("express");

const app = express();

const authRouter = require("./routes/auth.router")
const orderRouter = require("./routes/order.router")
const cartRouter = require("./routes/cart.router")
const productRouter = require("./routes/product.router")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cors = require("cors");

if (!process.env.JWT_SECRET) {
    console.error(
        "JWT_SECRET is not provided, fill it with random string or generate it using 'openssl rand -base64/-hex 32'"
    );
    process.exit(1);
}

app.use(cors());

app.use("/api/auth", authRouter)
app.use("/api/orders", orderRouter)
app.use("/api/carts", cartRouter)
app.use("/api/products", productRouter)

app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log("Server Running");
});