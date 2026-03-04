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
    tipe: DataTypes.STRING,       
    satuan: DataTypes.STRING,     
    jumlahKeluar: DataTypes.INTEGER,
    tglKeluar: DataTypes.DATEONLY,
    penerima: DataTypes.STRING,
    ulp: DataTypes.STRING         
  }, {
    sequelize,
    modelName: 'BarangKeluar',
  });
  return BarangKeluar;
};