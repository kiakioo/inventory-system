const { Barang, BarangMasuk, BarangKeluar, Cabang, sequelize } = require('../models');
const multer = require('multer');
const path = require('path');

// --- PENGATURAN UPLOAD FOTO BARANG MASUK ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, 'IN-' + Date.now() + path.extname(file.originalname)); }
});

const uploadImage = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Hanya izinkan gambar
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Hanya file gambar (JPG, PNG) yang diperbolehkan!'), false);
  }
});

exports.uploadFotoMiddleware = uploadImage.single('foto');

// --- TRANSAKSI BARANG MASUK ---
exports.catatBarangMasuk = async (req, res) => {
  const { nama, merk, tipe, jml, tgl, satuan } = req.body;
  const fotoName = req.file ? req.file.filename : null; // Ambil nama file jika ada
  
  const t = await sequelize.transaction();

  try {
    const namaBarang = nama || '';
    const merkBarang = merk || '';
    const tipeBarang = tipe || '';

    let [barang] = await Barang.findOrCreate({
      where: { nama: namaBarang, merk: merkBarang, tipe: tipeBarang },
      defaults: { stok: 0, satuan: satuan || 'Buah', tglMasuk: tgl, diterima: 'Gudang Utama' },
      transaction: t
    });

    const transaksiMasuk = await BarangMasuk.create({
      barang_id: barang.id,
      nama: namaBarang, merk: merkBarang, tipe: tipeBarang, 
      jumlah: parseInt(jml), tanggal_masuk: tgl, satuan: satuan || 'Buah',
      foto_bukti: fotoName // SIMPAN FOTO KE DATABASE
    }, { transaction: t });

    barang.stok += parseInt(jml);
    await barang.save({ transaction: t });

    await t.commit();
    res.status(201).json({ message: "Barang masuk berhasil dicatat!", data: transaksiMasuk });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Gagal mencatat barang masuk", error: error.message });
  }
};

// --- TRANSAKSI BARANG KELUAR ---
exports.catatBarangKeluar = async (req, res) => {
  const { nama, merk, tipe, jumlahKeluar, tglKeluar, penerima, ulp, satuan } = req.body;
  const t = await sequelize.transaction();

  try {
    const namaBarang = nama || '';
    const merkBarang = merk || '';
    const tipeBarang = tipe || '';

    const barang = await Barang.findOne({ 
      where: { nama: namaBarang, merk: merkBarang, tipe: tipeBarang },
      transaction: t 
    });

    if (!barang) {
      await t.rollback();
      return res.status(404).json({ message: "Barang tidak ditemukan!" });
    }

    const qty = parseInt(jumlahKeluar);
    if (barang.stok < qty) {
      await t.rollback();
      return res.status(400).json({ message: `Stok tidak mencukupi! Sisa stok hanya ${barang.stok}` });
    }

    const transaksiKeluar = await BarangKeluar.create({
      barang_id: barang.id,
      nama: namaBarang, merk: merkBarang, tipe: tipeBarang, 
      jumlahKeluar: qty, tglKeluar, penerima, ulp, satuan: satuan || 'Buah'
    }, { transaction: t });

    barang.stok -= qty;
    await barang.save({ transaction: t });

    await t.commit();
    res.status(201).json({ message: "Barang keluar berhasil dicatat!", data: transaksiKeluar });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Gagal mencatat barang keluar", error: error.message });
  }
};

exports.getRiwayatMasuk = async (req, res) => {
  try {
    const data = await BarangMasuk.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRiwayatKeluar = async (req, res) => {
  try {
    const data = await BarangKeluar.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRiwayatMasuk = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nama, merk, tipe, jumlah } = req.body;
    
    const riwayat = await BarangMasuk.findByPk(id, { transaction: t });
    if (!riwayat) throw new Error("Riwayat tidak ditemukan");

    const oldQty = riwayat.jumlah;
    const newQty = parseInt(jumlah);
    const selisih = newQty - oldQty; 

    const barang = await Barang.findByPk(riwayat.barang_id, { transaction: t });
    if (barang) {
      barang.stok += selisih;
      await barang.save({ transaction: t });
    }

    await riwayat.update({ nama, merk, tipe, jumlah: newQty }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: "Riwayat Masuk & Stok berhasil disinkronkan!" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

exports.updateRiwayatKeluar = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nama, merk, tipe, jumlahKeluar } = req.body;
    
    const riwayat = await BarangKeluar.findByPk(id, { transaction: t });
    if (!riwayat) throw new Error("Riwayat tidak ditemukan");

    const oldQty = riwayat.jumlahKeluar;
    const newQty = parseInt(jumlahKeluar);
    const selisih = newQty - oldQty; 

    const barang = await Barang.findByPk(riwayat.barang_id, { transaction: t });
    if (barang) {
      barang.stok -= selisih;
      if (barang.stok < 0) {
        throw new Error(`Gagal! Sisa stok master tidak cukup untuk perubahan ini.`);
      }
      await barang.save({ transaction: t });
    }

    await riwayat.update({ nama, merk, tipe, jumlahKeluar: newQty }, { transaction: t });

    await t.commit();
    res.status(200).json({ message: "Riwayat Keluar & Stok berhasil disinkronkan!" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  catatBarangMasuk: exports.catatBarangMasuk,
  catatBarangKeluar: exports.catatBarangKeluar,
  getRiwayatMasuk: exports.getRiwayatMasuk,
  getRiwayatKeluar: exports.getRiwayatKeluar,
  updateRiwayatMasuk: exports.updateRiwayatMasuk,
  updateRiwayatKeluar: exports.updateRiwayatKeluar,
  uploadFotoMiddleware: exports.uploadFotoMiddleware // Export middleware
};