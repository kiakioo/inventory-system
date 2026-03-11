const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Tambahan untuk menghapus file
const { ArsipDokumen } = require('../models');

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Hanya PDF yang diperbolehkan!'), false);
  }
});

exports.uploadMiddleware = upload.single('pdf_file');

exports.uploadDokumen = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File PDF wajib diupload!" });
    
    const { keterangan, uploader } = req.body;
    const newArsip = await ArsipDokumen.create({
      keterangan: keterangan || 'Dokumen BAST',
      nama_file: req.file.originalname,
      path_file: req.file.filename,
      uploader: uploader || 'Staff'
    });

    res.status(201).json({ message: "Dokumen berhasil diarsipkan!", data: newArsip });
  } catch (error) {
    res.status(500).json({ message: "Gagal menyimpan ke database", error: error.message });
  }
};

exports.getHistoryArsip = async (req, res) => {
  try {
    const data = await ArsipDokumen.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FITUR BARU: Hapus Arsip
exports.deleteArsip = async (req, res) => {
  try {
    const { id } = req.params;
    const arsip = await ArsipDokumen.findByPk(id);
    
    if (!arsip) {
      return res.status(404).json({ message: "Data arsip tidak ditemukan!" });
    }

    // 1. Hapus file fisik PDF dari folder uploads
    const filePath = path.join(__dirname, '../uploads', arsip.path_file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
    }

    // 2. Hapus data dari MySQL
    await arsip.destroy();

    res.status(200).json({ message: "Arsip berhasil dihapus sepenuhnya!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus arsip", error: error.message });
  }
};