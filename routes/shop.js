const path = require("path");

const express = require("express");

const productsController = require("../controllers/shop");

const router = express.Router();

router.get("/", productsController.getIndex);

router.get("/products", productsController.getProducts);

router.get("/products/:productId", productsController.getProduct);

router.get("/cart", productsController.getCart);

router.post("/cart", productsController.postCart);

router.post("/cart-delete-item", productsController.postCartDeleteItem);

// router.get("/orders", productsController.getOrders);

// router.post("/create-order", productsController.postOrder);

// router.get("/checkout", productsController.getCheckout);

module.exports = router;
