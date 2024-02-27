var express = require("express");
var router = express.Router();
const Category = require("../Model/categories");
const Subcategory = require("../Model/subCategories");
const Brand = require("../Model/brand");
const Allproducts = require("../Model/allProducts");
const User = require("../Model/userdetails");
const AWS= require ('aws-sdk')
const env = require('dotenv');
env.config()


let s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESKEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: "us-east-1"
  },
});
// AWS.config.update({  });

console.log(s3,"ssssssssssssssssssssss")

module.exports = {
  getAdminHomePage: async (req, res) => {
    try {
      res.render("admin/home");
    } catch (error) {
      console.log(error);
    }
  },

  getAllProductsPage: async (req, res) => {
    try {
      const products = await Allproducts.find();
      console.log(products,'gfgfgfgfgfgfgfg');
      res.render("admin/allproducts", { products });

    } catch (error) {
      console.log(error);
    }
  },

  getOrderListPage: async (req, res) => {
    try {
      res.render("admin/orderlist");
    } catch (error) {
      console.log(error);
    }
  },

  getOrderDetailsPage: async (req, res) => {
    try {
      res.render("admin/orderdetails");
    } catch (error) {
      console.log(error);
    }
  },

  getAddNewProductPage: async (req, res) => {
    try {
      const categories = await Category.find();
      const subcategories = await Subcategory.find();
      const brands = await Brand.find();
      console.log(categories);
      res.render("admin/addproduct", {
        categories: categories,
        subcategories: subcategories,
        brands: brands,
      });
    } catch (error) {
      console.log(error);
    }
  },

  getCustomerList: async (req, res) => {
    try {
      res.render("admin/customerlist");
    } catch (error) {
      console.log(error);
    }
  },

  getCustomerDetails: async (req, res) => {
    try {
      res.render("admin/customerdetails");
    } catch (error) {
      console.log(error);
    }
  },

  getSignUpPage: async (req, res) => {
    try {
      res.render("admin/signup");
    } catch (error) {
      console.log(error);
    }
  },

  getReviews: async (req, res) => {
    try {
      res.render("admin/reviews");
    } catch (error) {
      console.log(error);
    }
  },

  getBrands: async (req, res) => {
    try {
      const categories = await Category.find({}, "categoryName");
      const brands = await Brand.find({});
      res.render("admin/brand", { categories, brands });
    } catch (error) {
      console.log(error);
    }
  },

  getProductCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      const subcategories = await Subcategory.find().populate("category");

      res.render("admin/categories", { categories, subcategories });
    } catch (error) {
      console.log(error);
    }
  },

  createCategories: async (req, res) => {
    try {
      const { categoryName, description } = req.body;
      const newCategory = new Category({
        categoryName,
        description,
      });

      const savedCategory = await newCategory.save();
      res.json(savedCategory);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  categoryTable: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createSubcategory: async (req, res) => {
    try {
      const { subcategoryName, selectedCategory } = req.body;

      console.log(req.body);

      const newSubcategory = await Subcategory.create({
        name: subcategoryName,
        category: selectedCategory,
      });

      const category = await Category.findById(selectedCategory);

      const updatedCategory = await Category.findByIdAndUpdate(
        selectedCategory,
        { $push: { subcategories: newSubcategory._id } },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({
        ...newSubcategory.toObject(),
        categoryName: category.categoryName,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server Error");
    }
  },

  addNewBrandPage: async (req, res) => {
    try {
      const categories = await Category.find();
      res.render("admin/addBrand", { categories });
    } catch (error) {
      console.log(error);
    }
  },

  addBrand: async (req, res) => {
    console.log(req.file);
    try {
      const { brandName, selectedCategories } = req.body;
      const image = req.file ? req.file.filename : null;
      console.log(brandName, image);
      console.log(selectedCategories);
      const categoryIds = Array.isArray(selectedCategories)
        ? selectedCategories
        : [selectedCategories];
      console.log(categoryIds);
      const newBrand = new Brand({
        brandName: brandName,
        image: image,
        category: categoryIds,
      });
      await newBrand.save();
      const brandId = newBrand._id;

      await Promise.all(
        categoryIds.map(async (categoryId) => {
          await Category.findByIdAndUpdate(categoryId, {
            $push: { brands: newBrand._id },
          });
        })
      );
      await Brand.findByIdAndUpdate(brandId, {
        $set: { category: categoryIds },
      });
      res.json({ message: "Brand created successfully", brand: newBrand });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getBrandsByCategory: async (req, res) => {
    try {
      const categoryId = req.query.categoryId;
      const category = await Category.findById(categoryId).populate("brands");
      res.json({ brands: category.brands });
    } catch (error) {
      console.error(error);
      res.status(500).send("internal server error");
    }
  },

  addProduct: async (req, res) => {
    try {
      console.log(req.body, "999999999999999999999999  ");
      
      const { subCategory, category, productTitle, brandName, description, cost } = req.body;
      const images = [];
  
      if (req.files) {
        // Use Promise.all to wait for all S3 uploads to complete
        await Promise.all(req.files.map(async (image) => {
          const uploadParams = {
            Bucket: 'smd.com',
            Key: image.originalname,
            Body: image.buffer,
            ContentType: image.mimetype,
            ACL: 'public-read'
          };
  
          const data = await s3.upload(uploadParams).promise();
          images.push(data.Location);
          console.log(data.Location, "pppppppppppppp");
        }));
      }
  
      console.log(images, 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
  
      const newProduct = new Allproducts({
        productTitle,
        brandName,
        description,
        category,
        subCategory,
        cost,
        images,
      });
  
      console.log(newProduct, "000000000000000000000");
      await newProduct.save();
  
      await Category.findByIdAndUpdate(category, {
        $push: { products: newProduct._id },
      });
  
      await Subcategory.findByIdAndUpdate(subCategory, {
        $push: { products: newProduct._id },
      });
  
      // await Brand.findByIdAndUpdate(brand, {
      //   $push: { products: newProduct._id },
      // });
  
      res.json({ message: "product added", product: newProduct });
    } catch (error) {
      console.log(error)
      res.status(500).send("internal server error");
    }
  },
  

  // updateCategory : async (req, res) => {
  //     const {categoryId } = req.params;
  //     const {categoryName, description}=req.body

  //     console.log(req.body,"rrrrrrrrrr")

  //     try {
  //         const updatedCategory = await Category.findByIdAndUpdate(
  //             categoryId,
  //             { categoryName, description },
  //             { new: true }
  //         );

  //         if (!updatedCategory) {
  //             return res.status(404).json({ error: 'Category not found' });
  //         }

  //         res.status(200).json(updatedCategory);
  //     } catch (error) {
  //         console.error(error);
  //         res.status(500).json({ error: 'Internal Server Error' });
  //     }
  // }

  updateCategory: async (req, res) => {
    const { categoryId } = req.params;
    const { categoryName, description } = req.body;
    // console.log(categoryName,'gggggggggg')

    try {
      const updateCategory = await Category.findByIdAndUpdate(
        categoryId,
        { categoryName, description },
        { new: true }
      );
      if (!updateCategory) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.status(200).json(updateCategory);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteSubcategory: async (req, res) => {
    const subcategoryId = req.params.id;
    console.log("ttttttttttt");
    try {
      // Find the subcategory by ID and delete it
      const deletedSubcategory = await Subcategory.findByIdAndDelete(
        subcategoryId
      );
      console.log("fffffffffffff", deletedSubcategory);
      if (!deletedSubcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      // If deletion is successful, send a success response
      res.status(200).json({ message: "Subcategory deleted successfully" });
    } catch (error) {
      // Handle errors, and send an error response
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  deleteCategory: async (req, res) => {
    const categoryId = req.params.categoryId;
    console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    try {
      // Find and remove the category by ID
      const result = await Category.findByIdAndDelete(categoryId);

      if (result) {
        res.json({ success: true, message: "Category deleted successfully." });
      } else {
        res
          .status(404)
          .json({ success: false, message: "Category not found." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error." });
    }
  },
  deleteProduct: async(req,res)=>{
    const productId= req.params.productId;
    console.log(productId);

    try{
      const result = await Allproducts.findByIdAndDelete(productId)
      if(result){
        res.json({success: true, message: "Product deleted successfully."})
      }else{
        res
        .status(404)
        .json({success: false, message: "Product not found"});
      }
    }catch(error){
      console.log(error)
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error." });

    }

  }
};
