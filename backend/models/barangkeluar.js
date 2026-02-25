'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BarangKeluar extends Model {
    static associate(models) {
      // define association here
    }
  }
  BarangKeluar.init({
    nama: DataTypes.STRING,
    merk: DataTypes.STRING,
    tipe: DataTypes.STRING,       // Kolom Baru
    satuan: DataTypes.STRING,     // Kolom Baru
    jumlahKeluar: DataTypes.INTEGER,
    tglKeluar: DataTypes.DATEONLY,
    penerima: DataTypes.STRING,
    ulp: DataTypes.STRING         // Kolom Baru
  }, {
    sequelize,
    modelName: 'BarangKeluar',
  });
  return BarangKeluar;
};