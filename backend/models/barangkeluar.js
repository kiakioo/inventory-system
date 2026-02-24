'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BarangKeluar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BarangKeluar.init({
    barang_id: DataTypes.INTEGER,
    cabang_id: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    tanggal_keluar: DataTypes.DATE,
    penerima: DataTypes.STRING,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BarangKeluar',
  });
  return BarangKeluar;
};