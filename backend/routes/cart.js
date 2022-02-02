const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

const { verifyTokenandAuth, verifyTokenandAdmin, verifyToken } = require("./verifyToken");


//add new product
router.post("/", verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save();

        res.status(200).json(savedCart);

    } catch (err) {
        res.status(500).json(err)
    }
})


//get user cart
router.get("/find/:userId", verifyTokenandAuth , async (req, res) => {

    try {
        const cart = await Cart.findOne({userId: req.params.userId})
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err)
    }
})


//get all items in cart
router.get("/", verifyTokenandAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
})


//update product
router.put("/:id", verifyTokenandAuth, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate
            (req.params.id, {
                $set: req.body
            }, { new: true })

        res.status(200).json(updatedCart)

    } catch (err) {
        res.status(500).json(err)
    }
})


//delete product
router.delete("/:id", verifyTokenandAuth, async (req, res) => {

    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("cart product is deleted")

    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router