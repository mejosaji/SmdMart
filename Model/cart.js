const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    cartItems: [
        {
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "allProducts"
            },
            quantity: {
                type: Number,
                default: 1
            },
        },
    ],
})


const cart = mongoose.model('cart',cartSchema);
module.exports = cart;