'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BarangMasuk extends Model {
    static associate(models) {}
  }
  BarangMasuk.init({
    barang_id: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    merk: DataTypes.STRING,
    tipe: DataTypes.STRING,
    jumlah: DataTypes.INTEGER,
    tanggal_masuk: DataTypes.DATEONLY,
    satuan: DataTypes.STRING,
    foto_bukti: DataTypes.STRING 
  }, {
    sequelize,
    modelName: 'BarangMasuk',
  });
  return BarangMasuk;
};