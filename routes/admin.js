const path = require('path');
const User = require('../models/user');
const express = require('express');
// const multipart = require('connect-multiparty');
// const multipartMiddleware = multipart();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const isAdmin =require('../middleware/is-admin');
const { check, body } = require('express-validator');


const router = express.Router();

// /admin/add-product => GET
router.get('/add-project', isAuth,isAdmin, adminController.getAddProject);

// /admin/products => GET
router.get('/projects', isAuth,isAdmin, adminController.getProjects);

router.post(
    '/add-project',
    [
      body('title')
        .isString()
        .isLength({ min: 5 })
        .trim(),
      body('target').isFloat(),
      body('description')
        .isLength({ min: 5 })
        .trim(),
      body('endDate')
        .isDate()
        .trim(),
    body('startDate')
        .isDate()
        .trim(),

    ],
    isAuth,
    isAdmin,
    adminController.postAddProject
  );
  


router.get('/edit-project/:projectId', isAuth,isAdmin, adminController.getEditProject);

router.post('/edit-project',
    [body('title')
        .isString()
        .isLength({ min: 3 })
        .trim(),
    body('imageUrl')
        // .isURL()
        .trim(),
    body('target')
        .isFloat(),

    body('description')
        .isLength({ min: 5})
        .trim(),
    body('endDate')
        .isDate()
        .trim(),
    body('startDate')
        .isDate()
        .trim(),
    ]
    , isAuth,isAdmin, adminController.postEditProject);

router.post('/delete-project', isAuth,isAdmin, adminController.postDeleteProject);
router.post('/delete-manyproject',isAuth,isAdmin, adminController.postDelManyProject);
router.get('/filter',isAuth,isAdmin, adminController.getFilter);
router.get('/users',isAuth,isAdmin, adminController.getUsers);
router.post('/delete-user',isAuth,isAdmin, adminController.postDelUser);
router.post('/update-user',isAuth,isAdmin, adminController.postUpdateUser);
router.post('/delete-manyusers',isAuth,isAdmin, adminController.postdelManyusers);
router.post('/uploadfile', isAuth,isAdmin, adminController.postUploadfile);
router.post('/addusers',[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .toLowerCase()
    .custom((val, { req }) => {
      return User.findOne({ email: val })
        .then(user => {
          if (user) {
            return Promise.reject('Email đã sử dụng')
          }
        })
    }).normalizeEmail()
]
,isAuth,isAdmin, adminController.postAddusers);

router.post('/listAddusers',isAuth,isAdmin, adminController.postlistAddusers);

module.exports = router;
