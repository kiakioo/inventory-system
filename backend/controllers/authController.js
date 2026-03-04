const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'rahasia_super_aman_untuk_pln_parepare_123'; 

exports.register = async (req, res) => {
  try {
    console.log("🟢 REQUEST REGISTRASI:", req.body.email);
    const { name, email, password, role } = req.body;
    
    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Simpan ke database
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role: role || 'Staff' 
    });
    
    console.log("✅ REGISTRASI SUKSES!");
    res.status(201).json({ message: "Registrasi berhasil!", data: newUser });
  } catch (error) {
    console.error("🔴 ERROR REGISTRASI:", error.message);
    
    // Cek apakah errornya karena email duplikat di MySQL
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: "Email ini sudah digunakan oleh akun lain." });
    }
    
    res.status(500).json({ message: "Gagal registrasi", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // --- MODE DETEKTIF DIMULAI ---
    console.log("\n=========================================");
    console.log("🟢 ADA PERMINTAAN LOGIN MASUK");
    console.log("-> Email yang diketik    :", email);
    console.log("-> Password yang diketik :", password);
    console.log("-> Panjang kata sandi    :", password ? password.length : 0, "karakter");
    console.log("=========================================\n");

    // 1. Cari Email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("🔴 KESIMPULAN: Email tidak ditemukan di database.");
      return res.status(404).json({ message: "Email tidak terdaftar!" });
    }

    // 2. Cocokkan Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("-> Hash dari Database    :", user.password);
    console.log("-> Apakah cocok?         :", isPasswordValid ? "YA, COCOK!" : "TIDAK COCOK!");

    if (!isPasswordValid) {
      console.log("🔴 KESIMPULAN: Password Ditolak.");
      return res.status(401).json({ message: "Password yang Anda masukkan salah!" });
    }

    // 3. Login Sukses
    console.log("✅ KESIMPULAN: Login Sukses!");
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: "Login berhasil!", token, user });
  } catch (error) {
    console.error("🔴 SERVER ERROR SAAT LOGIN:", error);
    res.status(500).json({ message: "Terjadi kesalahan sistem", error: error.message });
  }
};