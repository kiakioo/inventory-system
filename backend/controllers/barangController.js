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

// Ekspor semua fungsi agar rute bisa membacanya
module.exports = { 
  getAllBarang: exports.getAllBarang, 
  createBarang: exports.createBarang 
};