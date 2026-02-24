const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'rahasia_super_aman_untuk_pln_parepare_123'; 

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role: role || 'Staff' });
    res.status(201).json({ message: "Registrasi berhasil!", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Gagal registrasi", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email tidak ditemukan!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Password salah!" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: "Login berhasil!", token, user });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
  }
};

// Pastikan baris ini ada di paling bawah!
module.exports = { register: exports.register, login: exports.login };