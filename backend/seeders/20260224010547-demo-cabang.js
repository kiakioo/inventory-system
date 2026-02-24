'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Cabangs', [
      { 
        nama_cabang: 'ULP Mattirotasi', 
        alamat: 'Kota Parepare (Koordinat: -4.010627777016814, 119.62348580350613)', 
        kontak: '32510', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        nama_cabang: 'ULP Barru', 
        alamat: 'Kab Barru (Koordinat: -4.423018274000974, 119.6181884407122)', 
        kontak: '32520', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        nama_cabang: 'ULP Rappang', 
        alamat: 'Kab Sidenreng Rappang (Koordinat: -3.8437393006917424, 119.81768041839209)', 
        kontak: '32530', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        nama_cabang: 'ULP Tanrutedong', 
        alamat: 'Kab Sidenreng Rappang (Koordinat: -3.8943797306150754, 120.00093765545742)', 
        kontak: '32540', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        nama_cabang: 'ULP Pangsid', 
        alamat: 'Kab Sidenreng Rappang (Koordinat: -3.926174877347532, 119.80137258758532)', 
        kontak: '32550', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        nama_cabang: 'ULP Soppeng', 
        alamat: 'Kab Soppeng (Koordinat: -4.336109049586647, 119.88871335972551)', 
        kontak: '32560', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        nama_cabang: 'ULP Pajalesang', 
        alamat: 'Kab Soppeng (Koordinat: -4.3304225903814935, 120.00678586637184)', 
        kontak: '32570', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Cabangs', null, {});
  }
};