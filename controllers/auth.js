const crypto = require('crypto');
const bcrypt = require('bcryptjs');
//const nodemailer = require('nodemailer');
//const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
const {sendmail} = require('../util/sendmail');
const User = require('../models/user');
// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         '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'
//     }
//   })
// );
exports.postAccuracy = (req,res,next)=>{
    const email =  req.body.email ;
    const otp = req.body.otp;
    User.findOne({ email: email })
    .then(user => {
      if(user.otp == otp){
         // thành công 
          //->> cập nhật dữ liệu -> chuyển đến login
          user.confirmDate = new Date();
          user.status = 'verified';
          user.save();
          res.redirect('/login');
      } else {
        // không thành công 
        // ->> gửi lại mã xác thực
        const otp =  Math.floor(Math.random() * (99999-10000) + 100000);
        user.otp = otp;
        user.save();
        console.log('otp:'+ otp);
        sendmail(email,otp);
        res.render('auth/accuracy', {
          path: '/accuracy',
          pageTitle: 'Accuracy',
          resend:  true,
          email: email,
        });
      }
    })
    .catch(err => console.log(err))
}
exports.getAccuracy = (req,res,next)=>{
  const email = req.email;
  console.log(email);
  res.render('auth/accuracy', {
    path: '/accuracy',
    pageTitle: 'Accuracy',
    email: email,
  });
}
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: {
      email:'',
      password: '',
    },
    validationErrors :[]
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput : {
      email: '',
      password : '',
      confirmPassword: ''
      },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      if(user.status =='waiting'){
        const otp =  Math.floor(Math.random() * (99999-10000) + 100000);
        user.otp = otp;
        user.save();
        console.log('otp:'+ otp);
        sendmail(user.email,otp);
        return res.render('auth/accuracy', {
          path: '/accuracy',
          pageTitle: 'Accuracy',
          resend:  false,
          email: user.email,
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            console.log(req.session);
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postSignup = (req, res, next) => {
  const otp =  Math.floor(Math.random() * (99999-10000) + 100000);
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput : {
        email: email,
        password : password,
        confirmPassword: confirmPassword,
        name: name
        },
        validationErrors: errors.array()
    });
  }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            name: name,
            avatar: '',
            permission: false,
            startDate: new Date(),
            status: 'waiting',
            confirmDate: null,
            otp: otp,
          });
          return user.save();
        })
        .then(result => {
          console.log('otp:'+ otp);
          sendmail(email,otp);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
          res.render('auth/accuracy', {
            path: '/accuracy',
            pageTitle: 'Accuracy',
            email: email,
            resend: false
          });
          // return transporter.sendMail({
          //   to: email,
          //   from: 'shop@node-complete.com',
          //   subject: 'Signup succeeded!',
          //   html: '<h1>You successfully signed up!</h1>'
          // });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};







