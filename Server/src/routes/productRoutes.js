const express = require('express');
const multer = require('multer');
const productController = require('../controllers/productController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply authMiddleware to all routes
router.use(authMiddleware);

router.post('/', productController.createProduct);
router.get('/:id', productController.getProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/', productController.getAllProducts);
router.post('/bulk-insert', upload.single('file'), productController.bulkInsertProducts);

module.exports = router;
