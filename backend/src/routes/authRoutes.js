// routes/authRoutes.js
const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/register', authController.register); //define rota post
router.post('/verify-otp', authController.verifyOTP);
router.post('/login', authController.login);
router.get('/users', authController.getAllUsers);

module.exports = router;
