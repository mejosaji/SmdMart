var mongoose = require('mongoose');

const subcategoryschema = new mongoose.Schema({
    name : {
        type : String
    },

    category : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Category',
        
    },

    products : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'allProducts'
        }
    ]

});

const Subcategory = mongoose.model('Subcategory',subcategoryschema);
module.exports = Subcategory;