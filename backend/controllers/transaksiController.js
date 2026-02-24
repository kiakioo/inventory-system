const { Barang, BarangMasuk, BarangKeluar, Cabang, sequelize } = require('../models');

// --- TRANSAKSI BARANG MASUK ---
exports.catatBarangMasuk = async (req, res) => {
  const { barang_id, jumlah, tanggal_masuk, supplier, keterangan } = req.body;
  
  // Memulai transaksi database agar data aman jika terjadi error di tengah jalan
  const t = await sequelize.transaction();

  try {
    // 1. Cari data barang yang akan ditambah
    const barang = await Barang.findByPk(barang_id, { transaction: t });
    if (!barang) {
      await t.rollback();
      return res.status(404).json({ message: "Barang tidak ditemukan!" });
    }

    // 2. Catat riwayat di tabel BarangMasuk
    const transaksiMasuk = await BarangMasuk.create({
      barang_id, jumlah, tanggal_masuk, supplier, keterangan
    }, { transaction: t });

    // 3. Tambahkan stok barang
    barang.stok += parseInt(jumlah);
    await barang.save({ transaction: t });

    // 4. Jika semua sukses, simpan permanen (commit)
    await t.commit();
    res.status(201).json({ message: "Barang masuk berhasil dicatat & stok bertambah!", data: transaksiMasuk });

  } catch (error) {
    // Jika ada error di tengah jalan, batalkan semua perubahan (rollback)
    await t.rollback();
    res.status(500).json({ message: "Gagal mencatat barang masuk", error: error.message });
  }
};

// --- TRANSAKSI BARANG KELUAR (DISTRIBUSI KE CABANG) ---
exports.catatBarangKeluar = async (req, res) => {
  const { barang_id, cabang_id, jumlah, tanggal_keluar, penerima, keterangan } = req.body;
  const t = await sequelize.transaction();

  try {
    // 1. Cari data barang
    const barang = await Barang.findByPk(barang_id, { transaction: t });
    if (!barang) {
      await t.rollback();
      return res.status(404).json({ message: "Barang tidak ditemukan!" });
    }

    // 2. VALIDASI STOK: Jangan biarkan barang keluar jika stok tidak cukup (minus)
    if (barang.stok < parseInt(jumlah)) {
      await t.rollback();
      return res.status(400).json({ 
        message: `Stok tidak mencukupi! Sisa stok saat ini hanya ${barang.stok}` 
      });
    }

    // 3. Catat riwayat di tabel BarangKeluar
    const transaksiKeluar = await BarangKeluar.create({
      barang_id, cabang_id, jumlah, tanggal_keluar, penerima, keterangan
    }, { transaction: t });

    // 4. Kurangi stok barang
    barang.stok -= parseInt(jumlah);
    await barang.save({ transaction: t });

    // 5. Simpan permanen (commit)
    await t.commit();
    res.status(201).json({ message: "Barang keluar berhasil dicatat & stok berkurang!", data: transaksiKeluar });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Gagal mencatat barang keluar", error: error.message });
  }
};

// --- GET RIWAYAT TRANSAKSI (Untuk ditampilkan di tabel Frontend nanti) ---
exports.getRiwayatMasuk = async (req, res) => {
  try {
    const data = await BarangMasuk.findAll({ include: [{ model: Barang, as: 'barang' }] });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRiwayatKeluar = async (req, res) => {
  try {
    const data = await BarangKeluar.findAll({ 
      include: [
        { model: Barang, as: 'barang' },
        { model: Cabang, as: 'cabang' }
      ] 
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};