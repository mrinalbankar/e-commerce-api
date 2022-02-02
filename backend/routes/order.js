const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

const { verifyTokenandAuth, verifyTokenandAdmin, verifyToken } = require("./verifyToken");


//add new order
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();

        res.status(200).json(savedOrder);

    } catch (err) {
        res.status(500).json(err)
    }
})


//get user order Id
router.get("/find/:userId", verifyTokenandAuth, async (req, res) => {

    try {
        const orders = await Order.find({ userId: req.params.userId })
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err)
    }
})


//get all orders
router.get("/", verifyTokenandAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders)
    } catch (err) {
        res.status(500).json(err)
    }
})


//get monthly status/income
router.get("/income", verifyTokenandAdmin, async (req, res) => {

    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {

        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: prevMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount"
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" }
                }
            }
        ])
        res.status(200).json(income)

    } catch (err) {
        res.status(500).json(err)
    }
})


//update order
router.put("/:id", verifyTokenandAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate
            (req.params.id, {
                $set: req.body
            }, { new: true })

        res.status(200).json(updatedOrder)

    } catch (err) {
        res.status(500).json(err)
    }
})


//delete product
router.delete("/:id", verifyTokenandAdmin, async (req, res) => {

    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("order is deleted")

    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router