const express = require('express');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(cors()); 
app.use(express.json()); 

const authRoutes = require('./routes/authRoutes');
const barangRoutes = require('./routes/barangRoutes'); 
const transaksiRoutes = require('./routes/transaksiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/barang', barangRoutes); 
app.use('/api/transaksi', transaksiRoutes);

const PORT = process.env.PORT || 5000;

db.sequelize.sync({ alter: true }) 
  .then(() => {
    console.log("✅ Database synced & Columns updated successfully.");
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Gagal sync database:", err.message);
  });