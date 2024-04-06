const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const userRoutes = require('./routes/userRoutes');

const uri = process.env.DB_URI;

const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log("connected to db");
    } catch (e) {
        console.log(e);
    }
}

connect();

// app.use('/users', userRoutes);


app.listen(3000, () => console.log("server is running"));
