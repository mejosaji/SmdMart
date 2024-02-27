const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brandName : {
        type : String,
    },

    image : {
        type : String
    },
    category : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Category'
        },
    ],
    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'allProducts',
        }
    ]
});

const Brand = mongoose.model('Brand',brandSchema);
module.exports = Brand;