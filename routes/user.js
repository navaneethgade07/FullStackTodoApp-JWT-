const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { createToken, validateToken } = require('../utils/token');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

const registerRoute = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const hashPasswd = await bcrypt.hash(password, 12);

    user = new User({
      email,
      username,
      password: hashPasswd,
    });

    await user.save();

    const token = createToken(user._id);

    res.cookie('token', token, {
      withCredentials: true,
      httpOnly: false,
    });

    res.redirect('/login');

  } catch (error) {
    next(error);
  }
}

const loginRoute = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Both username and password are required' });
    }

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
    next(error);
  }
}

const profileRoute = async (req, res, next) => {
  try {
    res.render('todo');
  } catch (error) {
    next(error);
  }
}

const logoutRoute = (req, res) => {
  res.redirect('/');
}

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', registerRoute);

router.post('/login', loginRoute);

router.get('/profile', validateToken, profileRoute);

router.post('/logout', logoutRoute);

module.exports = router;
