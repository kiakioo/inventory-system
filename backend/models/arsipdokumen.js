'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArsipDokumen extends Model {
    static associate(models) {}
  }
  ArsipDokumen.init({
    keterangan: DataTypes.STRING,
    nama_file: DataTypes.STRING,
    path_file: DataTypes.STRING,
    uploader: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ArsipDokumen',
  });
  return ArsipDokumen;
};