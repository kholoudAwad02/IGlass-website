const productsModel = require("./products.model");
const mongoose = require("mongoose");

const DB_URL = 'mongodb://127.0.0.1:27017/iglass'                         // database url

const cartSchema = mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    userId: String,
    productId: String,                // amount with inital value 1
    timestamp: Number
});
const CartItem = mongoose.model("cart", cartSchema);

exports.addNewItem = data => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                let item = new CartItem(data);
                return item.save();
            })
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.getItemsByUser = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return CartItem.find(
                    { userId: userId },
                    {},
                    { sort: { timestamp: 1 } }
                );
            })
            .then(items => {
                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.editItem = (id, newData) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => CartItem.updateOne({ _id: id }, newData))
            .then(items => {
                mongoose.disconnect();
                resolve(items);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.deleteItem = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => CartItem.findByIdAndDelete(id))
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
                console.log("err is here22222222222");
            });
    });
};                                                           // function to minus product item's quantity in product model amount value when user post order


// exports.minusQuantity2 = (id) => {
//     return new Promise((resolve, reject) => {
//         mongoose
//             .connect(DB_URL)
//             .then(() => {
//                 return CartItem.updateOne({ _id: id }, { $inc: { amount: -1 } });
//             })
//             .then(() => {
//                 mongoose.disconnect();
//                 resolve();
//             })
//             .catch(err => {
//                 mongoose.disconnect();
//                 reject(err);
//             });
//     }); 

// }    




// from cart container
exports.deleteItem3 = (userId) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                // استخدم معرف المستخدم ومعرف المنتج لحذف العنصر
                return CartItem.findOneAndDelete({ userId: userId });
            })
            .then(() => {
                mongoose.disconnect();
                resolve();
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};

exports.getItemById = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => CartItem.findById(id))
            .then(item => {
                mongoose.disconnect();
                resolve(item);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};




