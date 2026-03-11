const express = require('express');
const router = express.Router();
const arsipController = require('../controllers/arsipController');

router.post('/upload', arsipController.uploadMiddleware, arsipController.uploadDokumen);
router.get('/', arsipController.getHistoryArsip);
router.delete('/:id', arsipController.deleteArsip); // Rute baru untuk hapus

module.exports = router;