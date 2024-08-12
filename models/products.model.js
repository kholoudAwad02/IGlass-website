const mongoose = require("mongoose")                                         // import mongoose
const DB_URL = "mongodb://localhost:27017/iglass"                      // database url

const productSchema = new mongoose.Schema({              // mode   
  _id: String,               
  name: String, 
  image: String,
  price: Number,
  description: String,
  category: String,
  Quantity : Number
})
const Product = mongoose.model('product', productSchema) 


exports.getAllProducts = () => {                                      // to get all products
        // connect    
        //  get products   
        // disconnect 
      return new Promise((resolve, reject) => {                                       
        mongoose.connect(DB_URL).then(() => {                                        // connect
          return Product.find({})                                                     // get products
      }).then(products => {                                                           // pass products
        mongoose.disconnect()                                                        // disconnect
        resolve(products)                                                               // resolve
      }).catch(err => reject(err))                                                     // reject
    }) 
  }


  exports.addNewProduct = data => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                let newProduct = new Product(data);
                return newProduct.save();
            })
            .then(products => {
                mongoose.disconnect();
                resolve(products);
            })
            .catch(err => {
                mongoose.disconnect();
                reject(err);
            });
    });
};
exports.checkDuplicateId = (id) => {
    return Product.exists({ _id: id });          // alert if duplicate  and in html page 

};

// function to minus product's quantity by 1 in database if user order product                                          >> ## replace with amount

exports.minusQuantity = (id) => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(DB_URL)
            .then(() => {
                return Product.updateOne({ _id: id }, { $inc: { Quantity: -1 } });
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