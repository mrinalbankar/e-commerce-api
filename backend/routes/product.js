const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const { verifyTokenandAuth, verifyTokenandAdmin } = require("./verifyToken");


//add new product
router.post("/", verifyTokenandAdmin, async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save();

        res.status(200).json(savedProduct);

    } catch (err) {
        res.status(500).json(err)
    }
})


//get single product
router.get("/find/:id", async (req, res) => {

    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err)
    }
})


//get all products
router.get("/", async (req, res) => {

    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            })
        } else {
            products = await Product.find()
        }

        res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err)
    }
})


//update product
router.put("/:id", verifyTokenandAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate
            (req.params.id, {
                $set: req.body
            }, { new: true })

        res.status(200).json(updatedProduct)

    } catch (err) {
        res.status(500).json(err)
    }
})


//delete product
router.delete("/:id", verifyTokenandAdmin, async (req, res) => {

    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("product is deleted")

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router