const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');

router.get('/', barangController.getAllBarang);
router.post('/', barangController.createBarang);
router.put('/stok/:id', barangController.updateStok);
router.delete('/:id', barangController.deleteBarang);

module.exports = router;