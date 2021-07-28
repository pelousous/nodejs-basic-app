const path = require("path");

const express = require("express");

const productsController = require("../controllers/shop");

const isAuth = require("../middleware/is_auth");

const router = express.Router();

router.get("/", productsController.getIndex);

router.get("/products", productsController.getProducts);

router.get("/products/:productId", productsController.getProduct);

router.get("/cart", isAuth, productsController.getCart);

router.post("/cart", isAuth, productsController.postCart);

router.post("/cart-delete-item", isAuth, productsController.postCartDeleteItem);

router.get("/orders", isAuth, productsController.getOrders);

router.post("/create-order", isAuth, productsController.postOrder);

// router.get("/checkout", productsController.getCheckout);

module.exports = router;
