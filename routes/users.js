var express = require('express');
var router = express.Router();
const { validateToken} = require('../jwt/jwt')

const {

  getUserHomePage,
  getAllProductsPage,
  getProductDetails,
  getContactPage,
  getCartPage,
  getCheckOut,
  categoryFilter,
  getSignup,
  getlogin,
  postLogin,
  postsignup,
  addtocart,

} = require('../Controllers/userController')

router.get('/',getUserHomePage);
router.get('/allproducts',validateToken, getAllProductsPage);
router.get('/productdetails',getProductDetails);
router.get('/contacts',validateToken, getContactPage);
router.get('/getcart/',validateToken,getCartPage);
router.get('/add-to-cart/:id',validateToken,addtocart)
router.get('/getcheckout',validateToken,getCheckOut)
router.get('/categoryfilter/:id',validateToken,categoryFilter);
router.post('/signup',postsignup)
router.get('/signup',getSignup);
router.get('/login',getlogin);


router.post('/login',postLogin)



module.exports = router;
