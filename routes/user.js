const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {createToken,validateToken} = require('../utils/token');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

// register route 
router.post('/register', async (req, res) => {
    try {
        const { username, password, email} = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        };

        const hashPasswd = await bcrypt.hash(password, 12)

        user = new User({
            email,
            username,
            password: hashPasswd,
        });
        await user.save();

        //  Create and sign a JWT
        const token = createToken(user._id);

        // saving the token in the cookie with name `token`
        res.cookie('token', token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.redirect('/login');

    } catch (error) {
        res.json({ success: false, message: `Error registration  occured` });
    }
});

// login route 
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = createToken(user._id);

        res.cookie('token', token, {
            withCredentials: true,
            httpOnly: false,
        });

        res.redirect('/profile');

    } catch (error) {
        res.status(500).json({ success: false, msg: `Authentication Error` })
    };
});


// protected route 
router.get('/profile', validateToken,  async (req, res) => {

    res.render('todo');
});

router.post('/logout',async(req,res)=>{
    res.redirect('/');
});

module.exports = router;

