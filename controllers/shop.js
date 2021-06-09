const Product = require('../models/product');

const getIndex = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
        });
    });
}

const getProducts = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });
    });
}

const getProduct = (req, res, next) => {
    const id = req.params.productId;
    const products = Product.fetchById(id,( product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: 'Product detail',
            path: 'products'
        })
    })
}

const getCart = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart'
    });
}

const getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    })
}

const getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    })
}


module.exports = {
    getProducts,
    getProduct,
    getIndex,
    getCart,
    getOrders,
    getCheckout
}