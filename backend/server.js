const express = require('express');
const cors = require('cors');
const db = require('./models'); // Memanggil konfigurasi database & model

const app = express();

// --- MIDDLEWARE ---
// Mengizinkan frontend (React) nanti untuk mengakses API ini tanpa diblokir (CORS)
app.use(cors()); 
// Membantu aplikasi membaca data inputan berupa JSON
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/authRoutes');
const barangRoutes = require('./routes/barangRoutes'); 
const transaksiRoutes = require('./routes/transaksiRoutes');

// --- GUNAKAN ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/barang', barangRoutes); 
app.use('/api/transaksi', transaksiRoutes);

// --- ROUTE DASAR (UNTUK TESTING) ---
app.get('/', (req, res) => {
  res.json({ 
    message: "Selamat datang di API Inventory Management System!",
    status: "Server Backend Berjalan Normal 🚀"
  });
});

// --- MENYALAKAN SERVER & KONEKSI DATABASE ---
const PORT = process.env.PORT || 5000;

// Mengecek koneksi ke database MySQL
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ Berhasil terhubung ke database inventory_db MySQL.");
    // Menyalakan server Express
    app.listen(PORT, () => {
      console.log(`🚀 Server backend menyala dan berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Gagal menghubungkan ke database:", err.message);
  });