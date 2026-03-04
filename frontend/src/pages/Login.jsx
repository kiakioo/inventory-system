import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // 1. Simpan akses ke memori browser
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // 2. Tampilkan pesan berhasil
      Swal.fire({ 
        icon: 'success', 
        title: 'Berhasil Login!', 
        text: `Selamat datang, ${response.data.user.name}`, 
        timer: 2000, // Pop-up akan tampil selama 2 detik
        showConfirmButton: false 
      }).then(() => {
        // PERBAIKAN: Gunakan window.location.href agar halaman me-refresh dirinya
        // dan aplikasi langsung membaca token izin masuk yang baru.
        window.location.href = '/'; 
      });

    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Gagal terhubung ke server backend.';
      Swal.fire({ 
        icon: 'error', 
        title: 'Login Gagal', 
        text: errorMsg 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE]">
      <div className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#00AFF0]"></div>
        <div className="text-center mb-8 mt-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">PLN INVENTORY</h2>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">UP3 PAREPARE</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Alamat Email</label>
            <input type="email" required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" 
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@pln.co.id" />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Password</label>
            <input type="password" required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" 
              value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full flex justify-center py-4 border border-transparent rounded-2xl shadow-sm shadow-blue-500/30 text-white bg-[#00AFF0] hover:bg-blue-500 font-black text-lg focus:outline-none transition-all active:scale-95 mt-4">
            MASUK KE SISTEM
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;