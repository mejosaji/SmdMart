
const mongoose = require('mongoose')


const userschema = new mongoose.Schema({

    name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      phone: {
        type: Number,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      blocked:{
        type:Boolean,
        default: false
    
      }


});

const User = mongoose.model('User',userschema)
module.exports = User;