const express = require('express');
const router = express.Router();
const barangController = require('../controllers/barangController');

// Definisi URL untuk fitur CRUD Barang
router.get('/', barangController.getAllBarang);           // Mengambil semua barang
router.post('/', barangController.createBarang);          // Menambah barang
router.put('/:id', barangController.updateBarang);        // Mengedit barang berdasarkan ID
router.delete('/:id', barangController.deleteBarang);     // Menghapus barang berdasarkan ID

module.exports = router;