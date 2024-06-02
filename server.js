const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const fileRoutes = require('./routes/fileRoutes');
const cookieParser = require('cookie-parser');

const config = require('./config');

const app = express();
app.use(cookieParser());

// const corsOptions = {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     exposedHeaders: [],
//     credentials: true
// };
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());

// Express middleware to handle CORS
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Allow requests from the specified origin
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow specific HTTP methods
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
//     res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, authorization headers)
//     next();
// });


const connect = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log("connected to db");
    } catch (e) {
        console.log(e);
    }
}

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/files', fileRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

connect();

app.listen(3000, () => console.log("server is running"));
