const path = require('path');
const express = require('express');

const userController = require('../controllers/userAction');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', userController.getIndex);
router.get('/project/:projId',userController.getDetails);
router.post('/quyengop',isAuth,userController.postQuyengop);

// router.get('/products', shopController.getProducts);

// router.get('/products/:productId', shopController.getProduct);

// router.get('/cart', isAuth, shopController.getCart);

// router.post('/cart', isAuth, shopController.postCart);

// router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

// router.post('/create-order', isAuth, shopController.postOrder);

// router.get('/orders', isAuth, shopController.getOrders);

// router.get('/orders/:orderId', isAuth, shopController.getOrderId);
module.exports = router;
