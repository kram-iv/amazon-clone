const router = require('express').Router()
const Product = require ("../models/Product")

const upload = require("../middlewares/upload-photo")
// POST request - create a new product
router.post('/products', upload.single("photo"),async(req,res) => {
  try {
    let product = new Product();
    product.title = req.body.title;
    product.description = req.body.description;
    product.photo = req.file.location;
    product.stockQuantity = req.body.stockQuantity;

    await product.save();

    res.json({
      status: true,
      message: "Successfully saved!!"
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})



// GET request - get all products
router.get('/products', async(req,res) => {
  try {
      let products = await Product.find();

      res.json({
          success: true,
          products: products
      })
  } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
})


// GET request - get a single product
router.get('/product/:id', async(req,res) => {
  try {
      let product = await Product.findOne({ _id: req.params.id });

      res.json({
          success: true,
          product: product
      })
  } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
})

// PUT request - update a single product
router.put('/product/:id', upload.single("photo"), async(req,res) => {
  try {
      let product = await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            title: req.body.title,
            price: req.body.price,
            category: req.body.categoryID,
            photo: req.file.location,
            description: req.body.description,
            owner: req.body.owner
          }
        },
        { upsert: true }
      );

      res.json({
        success: true,
        updatedProduct: product
      })
  } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
})

// DELETE request - delete a single product
router.delete('/product/:id', async(req,res) => {
  try {
    let deletedProduct = await Product.findOneAndDelete({ _id: req.params.id });

    if ( deletedProduct ) {
      res.json({
        status: true,
        message: "Successfully deleted!!"
      })
    }
  } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
})

module.exports = router
