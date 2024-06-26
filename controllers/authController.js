const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');
const uuid = require('uuid');



function generateAccessToken(user) {
    return jwt.sign(user, config.secretKey, { expiresIn: config.expiresIn });
}

function generateRefreshToken(user) {
    return jwt.sign(user, config.refreshSecretKey, { expiresIn: config.refreshExpiresIn });
}

exports.register = async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        if (!req.body.refreshToken) {
            newUser.refreshToken = uuid.v4();
        }
        await newUser.save();
        res.status(201).json({ message: "User Registration successfull" });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.username) {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(400).json({ message: "Email already exist" });
        }
    }
};



exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = generateAccessToken({ username: user.username });
        const refreshToken = generateRefreshToken({ username: user.username });


        refreshTokenGlobal = refreshToken;
        user.refreshToken = refreshToken;
        await user.save();
        const expiresIn = config.expiresIn

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/'
        });

        res.json({ accessToken, refreshToken, expiresIn });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


exports.refreshToken = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is missing' });
    }

    try {
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRECT_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired refresh token' });
            }


            const accessToken = generateAccessToken({ username: user.username });
            res.json({ accessToken });
        });

    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

