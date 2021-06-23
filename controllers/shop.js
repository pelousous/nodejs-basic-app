const Product = require("../models/product");
const Cart = require("../models/cart");

const getIndex = (req, res, next) => {
  const products = Product.fetchAll().then((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

const getProducts = (req, res, next) => {
  const products = Product.fetchAll().then((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

const getProduct = (req, res, next) => {
  const id = req.params.productId;
  const product = Product.fetchById(id).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: "Product detail",
      path: "products",
    });
  });
};

const getCart = (req, res, next) => {
  let cartProducts = [];
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      products.map((p) => {
        const prodFound = cart.products.find((el) => el.id === p.id);
        if (prodFound) {
          cartProducts.push({
            productData: p,
            qty: prodFound.qty,
          });
        }
      });
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: cartProducts,
      });
    });
  });
};

const postCart = (req, res, next) => {
  const { productId, price } = req.body;
  Cart.addProduct(productId, price);
  res.redirect("/");
};

const getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

const postCartDeleteItem = (req, res, next) => {
  const id = req.body.productId;
  const price = req.body.price;
  Cart.deleteProduct(id, price);
  res.redirect("/cart");
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getOrders,
  getCheckout,
  postCartDeleteItem,
};
