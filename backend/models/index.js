'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Membaca semua file model di folder ini
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Menjalankan fungsi relasi bawaan (jika ada)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// --- DEFINISI RELASI CUSTOM ---
if (db.Barang && db.BarangMasuk && db.BarangKeluar && db.Cabang) {
    // Relasi Barang <-> BarangMasuk
    db.Barang.hasMany(db.BarangMasuk, { foreignKey: 'barang_id', as: 'barang_masuk' });
    db.BarangMasuk.belongsTo(db.Barang, { foreignKey: 'barang_id', as: 'barang' });

    // Relasi Barang <-> BarangKeluar
    db.Barang.hasMany(db.BarangKeluar, { foreignKey: 'barang_id', as: 'barang_keluar' });
    db.BarangKeluar.belongsTo(db.Barang, { foreignKey: 'barang_id', as: 'barang' });

    // Relasi Cabang <-> BarangKeluar
    db.Cabang.hasMany(db.BarangKeluar, { foreignKey: 'cabang_id', as: 'barang_keluar' });
    db.BarangKeluar.belongsTo(db.Cabang, { foreignKey: 'cabang_id', as: 'cabang' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;