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
    tipe: DataTypes.STRING,       
    satuan: DataTypes.STRING,     
    jumlah: DataTypes.INTEGER,
    tanggal_masuk: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'BarangMasuk',
  });
  return BarangMasuk;
};