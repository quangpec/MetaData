const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const randomstring = require("randomstring");
const { validationResult } = require('express-validator');
const { sendmail, mailResetpass, mailNotification } = require('../util/sendmail');
const User = require('../models/user');
exports.postAccuracy = (req, res, next) => {
  const email = req.body.email;
  const otp = req.body.otp;
  User.findOne({ email: email })
    .then(user => {
      if (user.otp == otp) {
        // thành công 
        //->> cập nhật dữ liệu -> chuyển đến login
        user.confirmDate = new Date();
        user.status = 'verified';
        user.save();
        res.redirect('/login');
      } else {
        // không thành công 
        // ->> gửi lại mã xác thực
        const otp = Math.floor(Math.random() * (99999 - 10000) + 100000);
        user.otp = otp;
        user.save();
        console.log('otp:' + otp);
        sendmail(email, otp);
        res.render('auth/accuracy', {
          path: '/accuracy',
          pageTitle: 'Accuracy',
          resend: true,
          email: email,
        });
      }
    })
    .catch(err => console.log(err))
}
exports.getAccuracy = (req, res, next) => {
  const email = req.email | '';
  if (email == '') {
    return res.redirect('/login');
  }
  res.render('auth/accuracy', {
    path: '/accuracy',
    pageTitle: 'Accuracy',
    email: email,
  });
}
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (req.session.isLoggedIn == true) {
    res.redirect('/');
  };
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
      email: '',
      password: '',
    },
    validationErrors: []
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
    oldInput: {
      email: '',
      password: '',
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
      if (user.status == 'waiting') {
        const otp = Math.floor(Math.random() * (99999 - 10000) + 100000);
        user.otp = otp;
        user.save();
        console.log('otp:' + otp);
        sendmail(user.email, otp);
        return res.render('auth/accuracy', {
          path: '/accuracy',
          pageTitle: 'Accuracy',
          resend: false,
          email: user.email,
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch && user.status == 'verified') {
            req.session.isLoggedIn = true;
            console.log(req.session);
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          if (doMatch && user.status == 'block') {
            return res.status(422).render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              errorMessage: 'Tài khoản đã bị vô hiệu',
              oldInput: {
                email: email,
                password: password
              },
              validationErrors: []
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
  const otp = Math.floor(Math.random() * (99999 - 10000) + 100000);
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
      oldInput: {
        email: email,
        password: password,
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
        tokenResetpass: {
          token: null,
          expires: null
        }
      });
      return user.save();
    })
    .then(result => {
      sendmail(email, otp);
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

exports.postresetPass = (req, res, next) => {
  const email = req.body.emailreset;
  User.find({ email: email })
    .then(users => {
      const user = users[0];
      const token = randomstring.generate({
        length: 12,
        charset: 'alphabetic'
      });

      return bcrypt
        .hash(token, 12)
        .then(hashedToken => {
          user.tokenResetpass.token = hashedToken;
          currentDate = new Date();
          user.tokenResetpass.expires = new Date(currentDate.getTime() + 5 * 60000);
          user.save();
          urlToken = 'http://localhost:3000/resetpass?email='+ email + '&token=' + token; // 
          console.log(urlToken);
          mailResetpass(user, urlToken);
          req.flash('error','Kiểm tra email để lấy lại mật khẩu')
          res.redirect('/login'); //  cần fix :  đưa về trang thông báo.
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        })

    })
    .catch(err => {
      console.log(err)
      res.redirect('/login');
    })

  // lưu token vào database

  // let message = req.flash('error');
  // if (message.length > 0) {
  //   message = message[0];
  // } else {
  //   message = null;
  // }

  // res.render('auth/resetpass', {
  //   path: '/resetpass',
  //   pageTitle: 'Reset Pass',
  //   errorMessage: message,
  //   oldInput: {
  //     email: '',
  //     password: '',
  //   },
  //   validationErrors: []
  // });
}
exports.getresetPass = (req, res, next) => {
  const token = req.query.token||'';
  const email = req.query.email||'';
  if(token=='' || email ==''){
    req.flash('error','Lỗi truy cập vui lòng đăng nhập trước')
    return res.redirect('/login');
  }
  User.find({
    email: email
  }).then(users => {
    if(users.length ==0){
      req.flash('error','Lỗi truy cập vui lòng đăng nhập trước')
      return res.redirect('/login');
    }
    const user = users[0];
    bcrypt
        .compare(token,user.tokenResetpass.token)
        .then( doMatch =>{
          if (doMatch && user.tokenResetpass.expires.getTime() - new Date().getTime() < 0) {
            req.flash('error','Link truy cập quá hạn vui lòng thử lại')
            console.log('quá hạn')
            return res.redirect('/login') // token quá hạn 
          }else if (doMatch && user.tokenResetpass.expires.getTime() - new Date().getTime() >= 0){
             return res.render('auth/resetpass', {
              path: '/resetpass',
              pageTitle: 'Reset Pass',
              email: user.email,
              oldInput: {
               password: '',
             },
             validationErrors: []
           });
          }
          else {
            req.flash('error','Lỗi truy cập vui lòng thử lại')
            return res.redirect('/login');
          }

        })
  
   
  
  })
}
exports.postnewPass = (req,res,next) =>{
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword; 
  const email = req.body.email;
  if(password != confirmPassword){
    req.flash('error','Mật khẩu không trùng khớp vui lòng thử lại')
    return res.redirect('/login');
  }
  User.findOne({email: email})
  .then(user=>{
    console.log(email);
    return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      user.password = hashedPassword;
      user.tokenResetpass = {
        token: '',
        expires: null,
      }
      return user.save();
    })
    .then( result => {
      mailNotification(user.email, ' Mật khuẩ của bạn đã được thay đổi');
      res.redirect('/login');
    })
  })
  .catch(err => {
    console.log(err);
    req.flash('error','Lỗi! vui lòng thử lại')
    res.redirect('/login');
  })
}

