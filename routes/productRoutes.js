const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../middlewares/auth');

router.get('/', authenticateToken, productController.getAllProducts);
router.get('/:id', authenticateToken, productController.getProductById);
router.post('/create', authenticateToken, productController.createProduct);
router.put('/update/:id', authenticateToken, productController.updateProduct);
router.delete('/delete/:id', authenticateToken, productController.deleteProduct);

module.exports = router;
