const path = require("path");
const mime = require("mime");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const Product = require("../models/product");
//const Cart = require("../models/cart");
const Order = require("../models/order");

const ITEMS_PER_PAGE = 1;

const getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalProducts;

  // const products = Product.find({}).then((products) => {
  //   res.render("shop/index", {
  //     prods: products,
  //     pageTitle: "All Products",
  //     path: "/",
  //   });
  // });

  const products = Product.find({}).then((products) => {
    totalProducts = products.length;

    Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .then((products) => {
        res.render("shop/index", {
          prods: products,
          pageTitle: "Shop",
          path: "/",
          isAuthenticated: req.session.isLoggedIn,
          currentPage: page,
          totalProducts: totalProducts,
          hasNextPage: Math.ceil(totalProducts / ITEMS_PER_PAGE) > page,
          hasPreviousPage: page > 1,
          nextPage: page + 1,
          previousPage: page - 1,
          lastPage: Math.ceil(totalProducts / ITEMS_PER_PAGE),
        });
      });
  });
};

const getProducts = (req, res, next) => {
  const products = Product.find({}).then((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
      isAuthenticated: req.session.isLoggedIn,
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
      isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
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
  Order.find({ "user.userId": req.session.user._id }).then((orders) => {
    console.log(orders);
    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "/orders",
      orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  });

  // req.user.getOrders().then((orders) => {
  //   console.log(orders);
  //   res.render("shop/orders", {
  //     pageTitle: "Orders",
  //     path: "/orders",
  //     orders,
  //   });
  // });
};

const getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
    isAuthenticated: req.session.isLoggedIn,
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
  const user = req.user;

  user
    .populate("cart.items.productId")
    .execPopulate()
    .then((data) => {
      const products = data.cart.items.map((prod) => {
        return { product: { ...prod.productId._doc }, quantity: prod.quantity };
      });

      const order = new Order({
        products: products,
        user: {
          userId: data.id,
          email: user.email,
        },
      });

      order.save();
      user.cart.items = [];
      user.save();

      res.redirect("/cart");
    });
};

const getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId).then((order) => {
    if (!order) {
      return next(new Error("no Data found"));
    }

    if (req.session.user._id.toString() !== order.user.userId.toString()) {
      return next(new Error("Unauthorized"));
    }

    const invoicePath = path.join(
      "data",
      "invoices",
      "Invoice-" + orderId + ".pdf"
    );

    const doc = new PDFDocument();
    let total = 0;

    const mimetype = mime.lookup(invoicePath);
    const filename = path.basename(invoicePath);

    res.setHeader("Content-type", mimetype);
    res.setHeader("Content-disposition", "inline; filename=" + filename);

    doc.pipe(fs.createWriteStream(invoicePath));
    doc.pipe(res);
    doc.fontSize(20).text("List of invoices");
    doc.text("-------------------------------------");

    order.products.map((prod) => {
      total += prod.product.price * prod.quantity;
      doc
        .fontSize(16)
        .text(
          prod.product.title +
            " - quantity: " +
            prod.quantity +
            " - price: $" +
            prod.product.price
        );
    });

    doc.text("-----------------------------------");
    doc.fontSize(20).text("Total price: " + total);
    doc.end();

    /*
      res.setHeader("Content-disposition", "attachment; filename=" + filename);
      res.setHeader("Content-type", mimetype);

      const filestream = fs.createReadStream(invoicePath);
      filestream.on("open", function () {
        filestream.pipe(res);
      });
    */
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
  getInvoice,
};
