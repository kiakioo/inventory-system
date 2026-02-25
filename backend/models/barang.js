'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Barang extends Model {
    static associate(models) {
      // define association here jika ada
    }
  }
  Barang.init({
    nama: DataTypes.STRING,
    merk: DataTypes.STRING,
    tipe: DataTypes.STRING,       // Kolom Baru
    satuan: DataTypes.STRING,     // Kolom Baru
    stok: DataTypes.INTEGER,
    tglMasuk: DataTypes.DATEONLY,
    tglKeluar: DataTypes.DATEONLY,
    diterima: DataTypes.STRING,
    ulp: DataTypes.STRING         // Kolom Baru untuk filter report
  }, {
    sequelize,
    modelName: 'Barang',
  });
  return Barang;
};