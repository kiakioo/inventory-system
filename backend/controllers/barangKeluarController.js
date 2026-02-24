const { Barang } = require('../models');

// 1. READ: Mengambil semua data barang
exports.getAllBarang = async (req, res) => {
  try {
    const barangs = await Barang.findAll();
    res.status(200).json({ message: "Data barang berhasil diambil", data: barangs });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
  }
};

// 2. CREATE: Menambah barang baru
exports.createBarang = async (req, res) => {
  try {
    const { nama_barang, kategori, satuan, stok } = req.body;
    const newBarang = await Barang.create({ nama_barang, kategori, satuan, stok: stok || 0 });
    res.status(201).json({ message: "Barang berhasil ditambahkan", data: newBarang });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambah barang", error: error.message });
  }
};

// 3. UPDATE: Mengubah data barang
exports.updateBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_barang, kategori, satuan, stok } = req.body;
    
    const barang = await Barang.findByPk(id);
    if (!barang) return res.status(404).json({ message: "Barang tidak ditemukan" });

    await barang.update({ nama_barang, kategori, satuan, stok });
    res.status(200).json({ message: "Barang berhasil diperbarui", data: barang });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui barang", error: error.message });
  }
};

// 4. DELETE: Menghapus barang
exports.deleteBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const barang = await Barang.findByPk(id);
    if (!barang) return res.status(404).json({ message: "Barang tidak ditemukan" });

    await barang.destroy();
    res.status(200).json({ message: "Barang berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus barang", error: error.message });
  }
};