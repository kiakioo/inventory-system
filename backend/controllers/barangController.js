const { Barang } = require('../models');

exports.getAllBarang = async (req, res) => {
  try {
    const barangs = await Barang.findAll();
    res.status(200).json({ data: barangs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBarang = async (req, res) => {
  try {
    const newBarang = await Barang.create(req.body);
    res.status(201).json({ message: "Barang berhasil ditambah", data: newBarang });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStok = async (req, res) => {
  try {
    const { id } = req.params;
    const { stok } = req.body;
    
    const barang = await Barang.findByPk(id);
    if (!barang) return res.status(404).json({ message: "Data material tidak ditemukan!" });

    barang.stok = parseInt(stok);
    await barang.save();

    res.status(200).json({ message: "Stok berhasil diperbarui!", data: barang });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui stok", error: error.message });
  }
};

// FITUR BARU: Hapus Master Data Barang
exports.deleteBarang = async (req, res) => {
  try {
    const { id } = req.params;
    const barang = await Barang.findByPk(id);
    if (!barang) return res.status(404).json({ message: "Data material tidak ditemukan!" });

    await barang.destroy();
    res.status(200).json({ message: "Master barang berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus barang", error: error.message });
  }
};

module.exports = { 
  getAllBarang: exports.getAllBarang, 
  createBarang: exports.createBarang,
  updateStok: exports.updateStok,
  deleteBarang: exports.deleteBarang // Export fungsi hapus
};