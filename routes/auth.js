const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Show signup form
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/', (req, res) => {
  res.redirect("/posts");
});

// Handle signup
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      req.flash('error_msg', 'Username already exists');
      return res.redirect('/signup');
    }

    // Create new user
    await User.create({ username, password });
    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error during registration');
    res.redirect('/signup');
  }
});

// Show login form
router.get('/login', (req, res) => {
  res.render('auth/login');
});

// Handle login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.validatePassword(password))) {
      req.flash('error_msg', 'Invalid username or password');
      return res.redirect('/login');
    }

    req.session.user = {
      id: user.id,
      username: user.username
    };
    
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Error during login');
    res.redirect('/login');
  }
});

// Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router; 