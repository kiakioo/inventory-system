const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');

router.get('/', barangController.getAllBarang);
router.post('/', barangController.createBarang);
// RUTE BARU: Untuk mengubah stok berdasarkan ID
router.put('/stok/:id', barangController.updateStok);

module.exports = router;