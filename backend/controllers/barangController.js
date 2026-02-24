const { Barang } = require('../models');
exports.getAllBarang = async (req, res) => {
  try {
    const barangs = await Barang.findAll();
    res.status(200).json({ data: barangs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};