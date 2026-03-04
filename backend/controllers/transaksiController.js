const { Barang, BarangMasuk, BarangKeluar, Cabang, sequelize } = require('../models');

// --- TRANSAKSI BARANG MASUK ---
exports.catatBarangMasuk = async (req, res) => {
  const { nama, merk, tipe, jml, tgl, satuan } = req.body;
  const t = await sequelize.transaction();

  try {
    const namaBarang = nama || '';
    const merkBarang = merk || '';
    const tipeBarang = tipe || '';

    // PERBAIKAN: Gunakan 'nama' persis seperti di models/barang.js
    let [barang] = await Barang.findOrCreate({
      where: { 
        nama: namaBarang, 
        merk: merkBarang, 
        tipe: tipeBarang 
      },
      defaults: { stok: 0, satuan: satuan || 'Buah', tglMasuk: tgl, diterima: 'Gudang Utama' },
      transaction: t
    });

    const transaksiMasuk = await BarangMasuk.create({
      barang_id: barang.id,
      nama: namaBarang, 
      merk: merkBarang, 
      tipe: tipeBarang, 
      jumlah: parseInt(jml), 
      tanggal_masuk: tgl, 
      satuan: satuan || 'Buah'
    }, { transaction: t });

    barang.stok += parseInt(jml);
    await barang.save({ transaction: t });

    await t.commit();
    res.status(201).json({ message: "Barang masuk berhasil dicatat!", data: transaksiMasuk });

  } catch (error) {
    await t.rollback();
    console.error("🔴 Error Tambah Barang:", error);
    res.status(500).json({ message: "Gagal mencatat barang masuk", error: error.message });
  }
};

// --- TRANSAKSI BARANG KELUAR ---
exports.catatBarangKeluar = async (req, res) => {
  const { nama, merk, tipe, jumlahKeluar, tglKeluar, penerima, ulp, satuan } = req.body;
  
  // LOG PENTING: Untuk melihat apakah data masuk ke server
  console.log("🟢 REQUEST BARANG KELUAR DITERIMA:", req.body);
  
  const t = await sequelize.transaction();

  try {
    const namaBarang = nama || '';
    const merkBarang = merk || '';
    const tipeBarang = tipe || '';

    // PERBAIKAN: Gunakan 'nama' bukan 'nama_barang'
    const barang = await Barang.findOne({ 
      where: { 
        nama: namaBarang, 
        merk: merkBarang, 
        tipe: tipeBarang 
      },
      transaction: t 
    });

    if (!barang) {
      console.log("🔴 BARANG TIDAK DITEMUKAN DI DATABASE!");
      await t.rollback();
      return res.status(404).json({ message: "Barang tidak ditemukan! Pastikan Nama, Merk, dan Tipe sama persis." });
    }

    const qty = parseInt(jumlahKeluar);
    if (barang.stok < qty) {
      console.log("🔴 STOK KURANG!");
      await t.rollback();
      return res.status(400).json({ message: `Stok tidak mencukupi! Sisa stok hanya ${barang.stok}` });
    }

    // Catat riwayat Barang Keluar
    const transaksiKeluar = await BarangKeluar.create({
      barang_id: barang.id,
      nama: namaBarang, 
      merk: merkBarang, 
      tipe: tipeBarang, 
      jumlahKeluar: qty, 
      tglKeluar, 
      penerima, 
      ulp, 
      satuan: satuan || 'Buah'
    }, { transaction: t });

    barang.stok -= qty;
    await barang.save({ transaction: t });

    await t.commit();
    console.log("✅ PENGELUARAN SUKSES!");
    res.status(201).json({ message: "Barang keluar berhasil dicatat!", data: transaksiKeluar });

  } catch (error) {
    await t.rollback();
    console.error("🔴 SERVER ERROR:", error);
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

module.exports = { 
  catatBarangMasuk: exports.catatBarangMasuk,
  catatBarangKeluar: exports.catatBarangKeluar,
  getRiwayatMasuk: exports.getRiwayatMasuk,
  getRiwayatKeluar: exports.getRiwayatKeluar
};