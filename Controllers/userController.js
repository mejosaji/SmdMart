const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const {createTokens, validateToken} = require('../jwt/jwt')
const Allproducts = require('../Model/allProducts');
const Category = require('../Model/categories');
const User = require("../Model/userdetails");


module.exports = {

    getUserHomePage : async(req,res)=>{
        try{
            res.render('user/index')
        }catch(error){
            console.log(error);
        }
    },

    getAllProductsPage : async(req,res)=>{
        try{
            const products = await Allproducts.find().populate('category');
            const categories = await Category.find()
            console.log(products,'hhhhhhhhhh11111111111111111');
            console.log(categories,'hhhhhhhhhh');

            res.render('user/allproducts',{products, categories});
        }catch(error){
            console.log(error);
        }
    },

    getProductDetails : async(req,res)=>{
        try{
            res.render('user/productdetails')
        }catch(error){
            console.log(error);
        }
    },

    getContactPage : async(req,res)=>{
        try{
            res.render('user/contact')
        }catch(error){
            console.log(error);
        }
    },

    getCartPage  :async(req,res)=>{
        try{
            res.json({ status: true });
        }catch(error){
            console.log(error);
        }
    },

    getCheckOut : async(req,res)=>{
        try{
            res.render('user/checkout')
        }catch(error){
            console.log(error);
        }
    },

    categoryFilter: async(req,res)=>{
        try{
            const categoryId= req.params.id
            const categories = await Category.find()
             const products = await Allproducts.find({ 'category': categoryId });
     console.log(products,"ttttttttttttttttttjjjjjjjjjjjjjj");

     res.render('user/categoryfilterpage',{products,categories});
        }catch(error){
      console.log(error);
        }
    },
    getSignup: async(req,res)=>{
        try{
            
            res.render('user/sigup')
        }catch(err){
            console.log(err);
        }
    },
    getlogin: async(req,res)=>{
        try{
            res.render('user/login')
        }catch(err){
            console.log(err);
        }
    },
    postLogin: async(req,res)=>{
        try{
            const{ email,password }=req.body
            
            const user = await User.findOne({email:email})
             console.log(user);
            const dbpassword= user.password
            bcrypt.compare(password, dbpassword).then((match)=>{
              if(!match){
                res
                .status(400)
                .json({error:"wrong username and password"})
              }else{
                
                const accessToken = createTokens(user)
                console.log(accessToken,'[ggrrtytyr');
                res.cookie("access-token", accessToken, {
                    maxAge: 1000*60*60*24,
                    httpOnly: true,
                })
                console.log(user._id,'yyy');
                var objectIdString = user._id.toString();

                // Extracting userId using regular expression
                var userId = objectIdString.substring(0, 24);
// Printing the userId
                console.log(userId,'hiii');
                res.cookie("user-id", userId, {
                    maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time (1 day)
                    httpOnly: true, // Cookie accessible only via HTTP(S)
                });
                

                 res.redirect('/allproducts')
              }
             
            })
           

    
        }catch(err){
            console.log(err);
        }
    },
        postsignup: async(req,res)=>{
            console.log('jgjgjg');
            try{
                console.log(req.body,'llllllllllllllllllllll');
                const { email, password, name, phone, gender, address } =req.body
                 const salt =10
              const hashPass= await bcrypt.hash(password,salt)
              console.log(hashPass,'yyyyyyyyyyyyy'); 

                const newUser = new User({
                    email,
                     password:hashPass,
                      name,
                       phone,
                        gender,
                         address,
                });
              
                await newUser.save();
                console.log(newUser,'NEW USER');

            }catch(err){
                console.log(err);
            }
        },

        addtocart: async(req,res)=>{
            console.log(req.params);
        }
    }
    


       
    

    
