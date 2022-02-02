const express = require('express');
const router = express.Router();

// const stripe = require ('stripe')(process.env.STRIPE_KEY);
const Stripe = require('stripe');
const stripe = Stripe("sk_test_51K8jZfSAwLA5Z25rt1PZYvtXIehD6x5KCPJBBmgvLDRBDRelkntHzIDxllcTGBuypL1BhZ1wOapQ7daMYXkC2saO009NlK0wCv");


router.post("/payment", (req, res) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "inr",
        metadata: {'order_id': '6735'}
    }, (stripeErr, stripeRes) => {
        if(stripeErr) {
            res.status(500).json(stripeErr)
        } else {
            res.status(200).status(stripeRes)
        }
    })
})

module.exports = router