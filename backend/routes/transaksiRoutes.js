const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

// Route untuk transaksi (POST)
router.post('/masuk', transaksiController.catatBarangMasuk);
router.post('/keluar', transaksiController.catatBarangKeluar);

// Route untuk melihat riwayat (GET)
router.post('/barang-masuk', transaksiController.catatBarangMasuk);
router.post('/barang-keluar', transaksiController.catatBarangKeluar); 
router.get('/riwayat-masuk', transaksiController.getRiwayatMasuk);
router.get('/riwayat-keluar', transaksiController.getRiwayatKeluar);

module.exports = router;