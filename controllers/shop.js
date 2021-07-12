const Product = require("../models/product");
//const Cart = require("../models/cart");

const getIndex = (req, res, next) => {
  const products = Product.find({})
    .populate("userId")
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    });
};

const getProducts = (req, res, next) => {
  const products = Product.find({}).then((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

const getProduct = (req, res, next) => {
  const id = req.params.productId;
  const product = Product.findById(id).then((product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: "Product detail",
      path: "products",
    });
  });
};

const getCart = (req, res, next) => {
  // let cartProducts = [];
  // Cart.getCart((cart) => {
  //   Product.fetchAll((products) => {
  //     products.map((p) => {
  //       const prodFound = cart.products.find((el) => el.id === p.id);
  //       if (prodFound) {
  //         cartProducts.push({
  //           productData: p,
  //           qty: prodFound.qty,
  //         });
  //       }
  //     });
  //     res.render("shop/cart", {
  //       pageTitle: "Cart",
  //       path: "/cart",
  //       products: cartProducts,
  //     });
  //   });
  // });

  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      console.log(user.cart.items);
      res.render("shop/cart", {
        pageTitle: "Cart",
        path: "/cart",
        products: user.cart.items,
      });
    });
};

const postCart = (req, res, next) => {
  const { productId } = req.body;
  const user = req.user;
  Product.findById(productId, (err, product) => {
    user.addToCart(product).then((response) => {
      res.redirect("/cart");
    });
  });
};

const getOrders = (req, res, next) => {
  req.user.getOrders().then((orders) => {
    console.log(orders);
    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "/orders",
      orders,
    });
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
  req.user
    .removeItemFromCart(id)
    .then((resp) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

const postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((resp) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  getProducts,
  getProduct,
  getIndex,
  getCart,
  postCart,
  getOrders,
  postOrder,
  getCheckout,
  postCartDeleteItem,
};
