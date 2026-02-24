import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      Swal.fire({ icon: 'success', title: 'Berhasil Login!', text: `Selamat datang, ${response.data.user.name}`, timer: 2000 });
      navigate('/dashboard');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Login Gagal', text: error.response?.data?.message || 'Terjadi kesalahan' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">PLN Inventory</h2>
          <p className="text-slate-500">UP3 Parepare - Logistik</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Email Address</label>
            <input type="email" required className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" required className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
              value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 font-bold focus:outline-none transition duration-200">
            MASUK KE SISTEM
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;