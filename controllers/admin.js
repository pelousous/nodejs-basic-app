const Product = require('../models/product');

const getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
}

const postAddProduct = (req, res, next) => {

    const product  = new Product();
    const title= req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    product.save(title, imageUrl, price, description);
    res.redirect('/');
}

const getProducts = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        });
    });
}

module.exports = {
    getAddProduct,
    postAddProduct,
    getProducts
}