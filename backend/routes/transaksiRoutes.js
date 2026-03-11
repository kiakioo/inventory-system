const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

router.post('/masuk', transaksiController.catatBarangMasuk);
router.post('/keluar', transaksiController.catatBarangKeluar);

router.post('/barang-masuk', transaksiController.uploadFotoMiddleware, transaksiController.catatBarangMasuk);
router.post('/barang-keluar', transaksiController.catatBarangKeluar); 
router.get('/riwayat-masuk', transaksiController.getRiwayatMasuk);
router.get('/riwayat-keluar', transaksiController.getRiwayatKeluar);

router.put('/masuk/:id', transaksiController.updateRiwayatMasuk);
router.put('/keluar/:id', transaksiController.updateRiwayatKeluar);

module.exports = router;