
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const payRoute = require('./routes/stripe');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//require and configure .env file
const dotenv = require('dotenv');
dotenv.config({ path: './config/.env' })


//connect to the database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
    .then(() => console.log("db connection successfull"))
    .catch((err) => { console.log(err) });


//add routes(api endpoints)
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/checkout", payRoute);

app.listen(process.env.PORT || 5000, () => {
    console.log('backend server is running');
})
