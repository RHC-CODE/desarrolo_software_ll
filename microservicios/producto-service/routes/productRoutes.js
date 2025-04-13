const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.post('/registrar', controller.registrarProducto);
router.get('/:codigo', controller.obtenerProducto);
router.put('/:codigo', controller.actualizarProducto);

module.exports = router;