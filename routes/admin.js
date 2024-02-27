var express = require('express');
var router = express.Router();
const upload = require('../Middlewares/mullter-config')

const {

  getAdminHomePage, 
  getAllProductsPage, 
  getOrderListPage, 
  getOrderDetailsPage,
  getAddNewProductPage,
  getCustomerList,
  getCustomerDetails,
  getSignUpPage,
  getReviews,
  getBrands,
  getProductCategories,
  createCategories,
  categoryTable,
  createSubcategory,
  addNewBrandPage,
  addBrand,
  getBrandsByCategory,
  addProduct,
  updateCategory,
  deleteSubcategory,
  deleteCategory,
deleteProduct
} = require('../Controllers/adminControllers');
const { uploads } = require('../multer/multer');


router.get('/',getAdminHomePage);
router.get('/getallproducts',getAllProductsPage);
router.get('/getorderlist',getOrderListPage);
router.get('/getorderdetails',getOrderDetailsPage);
router.get('/getaddnewproduct',getAddNewProductPage);
router.get('/getcustomerlist',getCustomerList);
router.get('/getcustomerdetails',getCustomerDetails);
router.get('/getsignuppage',getSignUpPage);
router.get('/getreviews',getReviews);
router.get('/getbrands',getBrands);
router.get('/getproductcategories',getProductCategories);
router.get('/getcategorytable',categoryTable);
router.get('/addnewbrandpage',addNewBrandPage);
router.get('/getbrandsbycategory',getBrandsByCategory)




router.put('/updatecategory/:categoryId', updateCategory);



router.delete('/deletesubcategory/:id',deleteSubcategory);
router.delete('/deletecategory/:categoryId', deleteCategory);
router.delete('/deleteproduct/:productId',deleteProduct)



router.post('/createcategories',createCategories);
router.post('/postsubcategory',createSubcategory);
router.post('/addbrand',upload.single('image'),addBrand);
// router.post('/addproduct',upload.single('image'), addProduct)
router.post('/addproduct',uploads,addProduct);

module.exports = router;
