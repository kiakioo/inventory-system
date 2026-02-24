'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BarangMasuk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BarangMasuk.init({
    barang_id: DataTypes.INTEGER,
    jumlah: DataTypes.INTEGER,
    tanggal_masuk: DataTypes.DATE,
    supplier: DataTypes.STRING,
    keterangan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BarangMasuk',
  });
  return BarangMasuk;
};