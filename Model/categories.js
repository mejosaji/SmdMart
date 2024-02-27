var mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    categoryName : {
        type : String,
    },
    description : {
        type : String
    },
    subcategories : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Subcategory',
        }
    ],
    brands : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Brand'
        }
    ],

    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'allProducts'
        }
    ]
});

const Category = mongoose.model('Category',categorySchema);
module.exports = Category;