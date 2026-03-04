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
    tipe: DataTypes.STRING,       
    satuan: DataTypes.STRING,     
    stok: DataTypes.INTEGER,
    tglMasuk: DataTypes.DATEONLY,
    tglKeluar: DataTypes.DATEONLY,
    diterima: DataTypes.STRING,
    ulp: DataTypes.STRING         
  }, {
    sequelize,
    modelName: 'Barang',
  });
  return Barang;
};