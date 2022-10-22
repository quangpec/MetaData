const express = require('express');
const userController = require('../controllers/userAction');
const router = express.Router();
router.get('/', userController.getIndex);
router.get('/viewtable/:tableId',userController.getDataTable);
router.post('/newTable',userController.postNewTable);
router.post('/postNewrow',userController.postNewrow);
module.exports = router;