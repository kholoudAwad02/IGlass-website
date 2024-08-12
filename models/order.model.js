const mongoose = require("mongoose");
const cartModel = require("./cart.model");
const productsModel = require("./products.model");
const DB_URL = 'mongodb://127.0.0.1:27017/iglass'                         // database url

const orderSchema = mongoose.Schema({
    username: String,
    userId: String,
    address: String,
    city : String,
    state : String,
    zip  : String,
    country : String,
    phone  : String,
    email  : String,
    image: String,
    productId: String,
    price: Number,
    timestamp: Number,
    status: {
        type: String,
        default: "pending"
    },
    timestamp: Number
});

const Order = mongoose.model("order", orderSchema);
                                                                  // add new order and delet from cart and update the quantity



exports.addNewOrder = data => {
    return new Promise((resolve, reject) => {
        let order;
                                                                                  // Step 1: Minus quantity from productsModel
        productsModel.minusQuantity(data.productId)
        
        .then(() => {
                                                                                     // Step 2: Delete item from cartModel
            return cartModel.deleteItem(data.cartId);
        })
        .then(() => {
                                                                                 // Step 3: Connect to the database
            return mongoose.connect(DB_URL);
        })
        .then(() => {
                                                                                          // Step 4: Set timestamp and save order
            data.timestamp = Date.now();
            order = new Order(data);
            console.log("updated quantity and deleted from cart"); 

            return order.save();
        })
        .then(() => {
                                                                                   // Step 5: Disconnect from the database and resolve
            mongoose.disconnect();
            resolve();
        })
        .catch(err => {
                                                                                          // Step 6: Handle errors, disconnect from the database, and reject
            mongoose.disconnect();
            reject(err);
            console.log("Error occurred:", err);
        });
    });
};



// exports.addNewOrder = data => {                                                                         //   2
//     return new Promise((resolve, reject) => {
//         let promise;
//         if (data.productId , data.cartId) {
//             // Subtract quantity from product model
//             promise = productsModel.minusQuantity(data.productId);
//             console.log("updated");
//         } else if (data.cartId) {
//             // Delete item from cart model
//             promise = cartModel.deleteItem(data.cartId);
//             console.log("deleted");
//         } else {
//             reject(new Error('Invalid data provided'));
//             return;
//         }

//         promise.then(() => mongoose.connect(DB_URL))
//             .then(() => {
//                 data.timestamp = Date.now();
//                 let order = new Order(data);
//                 return order.save();
//             })
//             .then(() => {
//                 mongoose.disconnect();
//                 resolve();
//             })
//             .catch(err => {
//                 mongoose.disconnect();
//                 reject(err);
//                 console.log("err is here");
//             });
//     });
// };

// exports.addNewOrder = data => {                                                      //1
//     return new Promise((resolve, reject) => { 
//             cartModel
//             .deleteItem(data.cartId) 
//             .then(() => mongoose.connect(DB_URL))
//             .then(() => {
//                 data.timestamp = Date.now();
//                 let order = new Order(data);
//                 return order.save();
//             })
//             .then(() => {
//                 mongoose.disconnect();
//                 resolve();
//             })
//             .catch(err => {
//                 mongoose.disconnect();
//                 reject(err);
//                 console.log("err is here");
//             });
//     });
// };

exports.getOrdersByUser = userId => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Order.find(
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

exports.cancelOrder = id => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => Order.findByIdAndDelete(id))
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

exports.getAllOrders = () => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Order.find({}, {}, { sort: { timestamp: 1 } });
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

exports.editOrder = (id, newStatus) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Order.updateOne({ _id: id }, { status: newStatus });
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
