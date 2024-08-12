const productsModel = require("../models/products.model");
const validationResult = require("express-validator").validationResult;

exports.getAddProduct = (req, res,next) => {
   res.render('addproduct.ejs',{
        isUser: true,
        isAdmin: true,
        pageTitle: "Add Product"
    });
};

exports.postAdd = (req, res, next) => {
    req.body.image = req.file.filename;
        productsModel
            .addNewProduct(req.body)
            .then(() => {
                res.redirect("/addproduct");
            })
            .catch(err => {
                console.log(' id is repeated');
            });
};


