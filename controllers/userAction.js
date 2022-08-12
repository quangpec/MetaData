const bcrypt = require('bcryptjs');
const path = require('path');
const Project = require('../models/project');
const User = require('../models/user');
const Contribute = require('../models/contribute');
const { ResultWithContext } = require('express-validator/src/chain');
const { Result } = require('express-validator');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const ITEMS_PER_PAGE =12;

// exports.getProducts = (req, res, next) =>{
//   const page = +req.query.page||1;
//   let totalItems;

//   Product.find()
//     .countDocuments()
//     .then(numProducts => {
//       totalItems = numProducts;
//       return Product.find()
//         .skip((page - 1) * ITEMS_PER_PAGE)
//         .limit(ITEMS_PER_PAGE);
//     })
//     .then(products => {
//       res.render('shop/product-list', {
//         prods: products,
//         pageTitle: 'All Products',
//         path: '/products',
//         totalProducts: totalItems,
//         hasNextPage: ITEMS_PER_PAGE * page < totalItems,
//         hasPreviousPage: page > 1,
//         nextPage: page + 1,
//         previousPage: page - 1,
//         lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
//         page: page,
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };


// exports.getProduct = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findById(prodId)
//     .then(product => {
//       res.render('shop/product-detail', {
//         product: product,
//         pageTitle: product.title,
//         path: '/products'
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };
exports.getProfile = (req,res,next)=>{
  const  message = req.flash('message')[0];
  const errors = req.flash('error')[0];
  console.log(errors);
  res.render('user/profile',{
    path: '/profile',
    pageTitle: 'Trang cá nhân',
    user: req.user,
    validationErrors:[],
    errorMessage:errors,
    message: message,
  })
}
exports.postChangepass =(req,res,next)=>{
  
  const pass_ = req.user.password;
  const pass = req.body.pass.trim(); 
  const password = req.body.password.trim(); 
  const confirmPassword = req.body.confirmPassword.trim();
  if(password.length <5){
    req.flash('error','Mật khẩu mới quá ngắn');
    return res.redirect('/profile');
  }

  else if ( password !== confirmPassword ){
    req.flash('error','Mật khẩu mới không khớp');
    return res.redirect('/profile');
  }
  else{
    bcrypt
    .compare(pass,pass_)
    .then(doMatch => {
      if (doMatch){
        bcrypt
        .hash(password, 12)
        .then(hashedPassword =>{
          User.findByIdAndUpdate(req.user._id,{password: hashedPassword})
          .then(result =>{
            req.flash('message','Cập nhật mật khẩu thành công');
             res.redirect('/profile');
          })
          .catch( err => {
            req.flash('error','Lỗi cập nhật mật khẩu');
            res.redirect('/profile');
          })
        })
      } else{
        req.flash('error','Mật khẩu hiện tại không đúng');
        res.redirect('/profile')
      }
      
  })
}


}
exports.getIndex = (req, res, next) => {
  const page = +req.query.page||1;
  let totalItems;
  Project.find()
    .countDocuments()
    .then(numProject => {
      totalItems = numProject;
      return Project.find()
        .sort({startDate:1})
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(projects => {
      res.render('user/index', {
        projs: projects,
        pageTitle: 'Home',
        path: '/',
        totalProject: totalItems,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        page: page,
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getDetails =(req,res,next)=>{
  user = req.user;
  const projId = req.params.projId;
  Project.findById(projId)
  .then( project =>{
    res.render('user/detail', {
      path: '/details',
      pageTitle: project.title,
      project: project,
      validationErrors: [],
      });
  })
}
exports.postQuyengop = (req,res,next)=>{
  const userId = req.user._id;
  const projId = req.body.projId;
 
  const contributionAmount = req.body.contributionAmount;
  const conTri = new Contribute({
    userId: ObjectId(userId),
    projectId: ObjectId(projId),
    contributionAmount: contributionAmount,
    status : 'done',
    conDate: new Date(),
  })
  conTri.save()
  .then(Result=>{
    Project.findById(projId)
    .then(project =>{
        project.luotQuyengop=project.luotQuyengop+ +1;
        project.totalAmountRaised=project.totalAmountRaised+ +contributionAmount;
        project.save()
        .then(result =>{
          console.log(result);
          return res.redirect('/');
        })
        .catch(err =>{
          console.log(err);
          next();
        })
    })
    
   })
  .catch( err => {
    console.log(err);
    next();
  })
}

// exports.getCart = (req, res, next) => {
//   req.user
//     .populate('cart.items.productId')
//     .execPopulate()
//     .then(user => {
//       const products = user.cart.items;
//       console.log('____________________', user.cart.items);
//       res.render('shop/cart', {
//         path: '/cart',
//         pageTitle: 'Your Cart',
//         products: products
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postCart = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId)
//     .then(product => {
//       return req.user.addToCart(product);
//     })
//     .then(result => {
//       console.log(result);
//       res.redirect('/cart');
//     });
// };

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .removeFromCart(prodId)
//     .then(result => {
//       res.redirect('/cart');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.postOrder = (req, res, next) => {
//   req.user
//     .populate('cart.items.productId')
//     .execPopulate()
//     .then(user => {
//       const products = user.cart.items.map(i => {
//         return { quantity: i.quantity, product: { ...i.productId._doc } };
//       });
//       const order = new Order({
//         user: {
//           email: req.user.email,
//           userId: req.user
//         },
//         products: products
//       });
//       return order.save();
//     })
//     .then(result => {
//       return req.user.clearCart();
//     })
//     .then(() => {
//       res.redirect('/orders');
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.getOrders = (req, res, next) => {
//   Order.find({ 'user.userId': req.user._id })
//     .then(orders => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders
//       });
//     })
//     .catch(err => {
//       const error = new Error(err);
//       error.httpStatusCode = 500;
//       return next(error);
//     });
// };

// exports.getOrderId =(req,res,next)=>{
//   const orderId = req.params.orderId;
//   if(!req.user){
//     return res.redirect('/');
//   }
//   Order.findById(orderId).then(order => {
//     if (!order){
//       return next(new Error('Không có thông tin hóa đơn'))
//     }
//     if(req.user._id.toString() !==order.user.userId.toString() ){
//       return next(new Error('không có quyền xem'))
//     }
//     const orderName = 'order-'+orderId+'.pdf';
//     const orderPath = path.join('data','orders',orderName);
//     const pdfDoc = new PDFdocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Dispositon', 'inline; filename="'+ orderName + '"');
//     pdfDoc.pipe(fs.createWriteStream(orderPath));
//     pdfDoc.pipe(res);
//     pdfDoc
//     .fontSize(20)
//     .text('order CODE - '+ orderId ,{underline:true});
//     pdfDoc.text('----------------------------------')
//     let totalCost = 0; 
//      order.products.forEach(prod => {
//       totalCost+= prod.quantity * prod.product.price;
//       pdfDoc
//     .fontSize(14)
//     .text(prod.product.title + ' - ' + prod.quantity + ' x '+ prod.product.price);
//      })
//      pdfDoc
//     .text('---')
//      pdfDoc
//     .fontSize(18)
//     .text('TotalCost: '+ ': '+ totalCost)
//     pdfDoc.end();
//     // fs.readFile(orderPath,(err,data)=>{
//     //   if (err){
//     //     return next(err);
//     //   }
//     //   res.setHeader('Content-Type', 'application/pdf');
//     //   res.send(data);
//     // });
    
//   }).catch(err => next(err))
// }