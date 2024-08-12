
const cartModel = require("../models/cart.model");
const validationResult = require("express-validator").validationResult;

exports.getCart = (req, res, next) => {
    cartModel.getItemsByUser(req.session.userId)
        .then(items => {
            let totalPrice = items.reduce((acc, item) => acc + item.price, 0); 
            res.render("cart.ejs", {
                items: items,
                totalPrice: totalPrice, 
                isUser: true,
                isAdmin: req.session.isAdmin,
                pageTitle: "Cart"
            });
        })
        .catch(err => {
            res.redirect("/error");
        });
};


exports.postCart = (req, res, next) => {
        cartModel
            .addNewItem({
                name: req.body.name,
                price: req.body.price,
                image : req.body.image,
                userId: req.session.userId,
                productId: req.body._id,
                timestamp: Date.now()
            })
            .then(() => {
                console.log("item added to cart")

                res.end();
            })
            .catch(err => {
                res.redirect("/error");
            });
    
};

exports.postSave = (req, res, next) => {
    if (validationResult(req).isEmpty()) {
        cartModel
            .editItem(req.body.cartId, {
                timestamp: Date.now()
            })
            .then(() => res.redirect("/cart"))
            .catch(err => res.redirect("/error"));
    } else {
        req.flash("validationErrors", validationResult(req).array());
        res.redirect("/cart");
    }
};

exports.postDelete = (req, res, next) => {
    cartModel
        .deleteItem(req.body.cartId)
        .then(() => res.redirect("/cart"))
        .catch(err => res.redirect("/error"));
};


exports.removeItem = (req, res, next) => {
const userId = req.session.userId;
cartModel.deleteItem3(userId)
    .then(() => {
      res.sendStatus(204); //  بدون محتوى للتأكيد على الحذف 
    })
    .catch(err => {
    console.error('Error removing item from cart:', err);
    res.status(500).send('Error removing item from cart');
    });
};
