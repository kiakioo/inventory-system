'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BarangKeluars', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      barang_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Barangs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cabang_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cabangs', // Mengacu ke tabel Cabangs
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      
      jumlah: {
        type: Sequelize.INTEGER
      },
      tanggal_keluar: {
        type: Sequelize.DATE
      },
      penerima: {
        type: Sequelize.STRING
      },
      keterangan: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BarangKeluars');
  }
};