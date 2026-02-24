const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

// Route untuk transaksi (POST)
router.post('/masuk', transaksiController.catatBarangMasuk);
router.post('/keluar', transaksiController.catatBarangKeluar);

// Route untuk melihat riwayat (GET)
router.get('/masuk', transaksiController.getRiwayatMasuk);
router.get('/keluar', transaksiController.getRiwayatKeluar);

module.exports = router;