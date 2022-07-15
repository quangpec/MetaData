const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);
router.get('/accuracy',authController.getAccuracy);

router.post(
  '/accuracy',
[
  body('otp')
  .trim()

],
authController.postAccuracy);
router.post(
    '/login',
    [
      body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
      body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
  );

router.post(
    '/signup',[
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((val, {req})=>{
        return User.findOne({ email: val })
        .then(user => {
          if (user) {
            return Promise.reject('Email đã sử dụng')
          }
      })
    }).normalizeEmail(), 
      body('password', 'mật khẩu ít nhất 5 kí tự, gồm chữ và số')
      .isLength({min: 5})
      .isAlphanumeric()
      .trim(),
      body('confirmPassword')
      .trim()
      .custom((val,{req})=>{
        if(val !== req.body.password){
            throw new Error('Mật khuẩ không trùng khớp')
        }
        else{
            return true
        }
      }),
      body('name', 'Tên ít nhất 3 kí tự')
        .isLength({ min: 3 })
        .trim()
    ],
    authController.postSignup
  );
  

router.post('/logout', authController.postLogout);

// router.get('/reset', authController.getReset);

// router.post('/reset', authController.postReset);

// router.get('/reset/:token', authController.getNewPassword);

// router.post('/new-password', authController.postNewPassword);

module.exports = router;
