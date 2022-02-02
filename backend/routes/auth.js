const express = require("express");
const router = express.Router();

const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//register
router.post("/register", async (req, res) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString()
    })

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch (err) {
        res.status(500).json(err);
    }
})


//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            res.status(401).json("Incorrect Credentials")
        }

        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        )

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        )
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)

        if (originalPassword !== req.body.password) {
            res.status(401).json("Incorrect password")
        }

        const { password, ...others } = user._doc;

        res.status(200).json({...others, accessToken})

    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router