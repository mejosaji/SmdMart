var mongoose = require('mongoose');

const allProductsSchema = new mongoose.Schema({

    productTitle : {
        type : String
    },

    brandName : {
        type : String
    },

    description : {
        type : String
    },

    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
  
    subCategory : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Subcategory',
    },

    cost : {
        type : String
    },

    images : {
        type : Array
    }
});

const allProducts = mongoose.model('allProducts',allProductsSchema);
module.exports = allProducts;