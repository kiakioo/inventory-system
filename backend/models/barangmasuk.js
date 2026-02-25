'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BarangMasuk extends Model {
    static associate(models) {
      // define association here
    }
  }
  BarangMasuk.init({
    nama: DataTypes.STRING,
    merk: DataTypes.STRING,
    tipe: DataTypes.STRING,       // Kolom Baru
    satuan: DataTypes.STRING,     // Kolom Baru
    jumlah: DataTypes.INTEGER,
    tanggal_masuk: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'BarangMasuk',
  });
  return BarangMasuk;
};