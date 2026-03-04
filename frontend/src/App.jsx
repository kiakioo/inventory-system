import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Box, ArrowUpRight, ArrowDownLeft, 
  LogOut, User as UserIcon, Zap, Search, FileDown, 
  ChevronRight, CheckCircle2, ListFilter, Users, UserPlus, Menu, X, Edit, PlusCircle, ToggleLeft
} from 'lucide-react';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Login from './pages/Login';
import api from './services/api'; 

// --- KOMPONEN NAVIGASI SIDEBAR ---
const NavItem = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-3 px-8 py-4 transition-all duration-200 border-r-4 ${isActive ? 'bg-blue-50/50 text-[#00AFF0] border-[#00AFF0] font-black' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-[#00AFF0] font-semibold'}`}
    >
      <Icon size={20} className={isActive ? "animate-pulse" : ""} />
      <span className="text-sm">{label}</span>
    </Link>
  );
};

// --- LAYOUT UTAMA ---
const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: "User", role: "Staff" };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-['Inter'] text-slate-700 relative overflow-hidden">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white flex flex-col shadow-[10px_0_15px_-3px_rgba(0,0,0,0.02)] z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-8 flex flex-col items-center justify-center border-b border-slate-50 relative">
          <button className="absolute top-6 right-6 md:hidden text-slate-400 hover:text-slate-700" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
          <div className="w-20 h-20 bg-white rounded-full border border-slate-100 flex items-center justify-center mb-4 shadow-md shadow-blue-900/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50/50"></div>
            <Zap className="text-[#00AFF0] relative z-10" fill="#FFF200" size={36} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-[#00AFF0] uppercase text-center">PLN Inventory</h2>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1 text-center">UP3 Parepare</p>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-8 mb-2">Utama</div>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/barang" icon={Box} label="History Report" onClick={() => setIsSidebarOpen(false)} />
          
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-8 mt-6 mb-2">Transaksi</div>
          <NavItem to="/transaksi-masuk" icon={ArrowDownLeft} label="Barang Masuk" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/transaksi-keluar" icon={ArrowUpRight} label="Barang Keluar" onClick={() => setIsSidebarOpen(false)} />

          {user.role === 'Admin' && (
            <>
              <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-8 mt-6 mb-2">Pengaturan</div>
              <NavItem to="/users" icon={Users} label="Manajemen User" onClick={() => setIsSidebarOpen(false)} />
            </>
          )}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-2xl font-bold text-sm transition-all active:scale-95">
            <LogOut size={18} /> Keluar Sistem
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 md:px-10 border-b border-slate-100 z-10 shrink-0">
          <div className="flex items-center gap-2 md:gap-3 text-slate-400 text-sm font-medium">
            <button className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100 mr-1" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <span className="hidden sm:inline">Aplikasi</span> 
            <ChevronRight size={14} className="hidden sm:inline text-slate-300" /> 
            <span className="text-[#00AFF0] font-black uppercase tracking-wide truncate max-w-[120px] sm:max-w-none">{title}</span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <div className="text-right hidden xs:block">
              <p className="text-sm font-black text-slate-800 leading-none truncate max-w-[150px]">{user.name}</p>
              <p className="text-[10px] text-[#00AFF0] font-bold uppercase mt-1">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#00AFF0] shadow-sm font-black text-lg shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- HALAMAN DASHBOARD ---
const Dashboard = ({ materials, stats, onRefresh }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'Admin';
  const totalStokTersisa = materials.reduce((acc, curr) => acc + (curr.stok || 0), 0);

  const handleEditStok = async (item) => {
    const { value: newStok } = await Swal.fire({
      title: `Edit Stok: ${item.nama}`,
      html: `Merk: <b>${item.merk}</b><br/>Tipe: <b>${item.tipe || '-'}</b>`,
      input: 'number',
      inputLabel: 'Masukkan jumlah fisik aktual (angka bebas)',
      inputValue: item.stok,
      showCancelButton: true,
      confirmButtonText: 'Simpan Perubahan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#00AFF0',
      inputValidator: (value) => {
        if (!value || value < 0) {
          return 'Stok tidak boleh kosong atau negatif!'
        }
      }
    });

    if (newStok !== undefined) {
      try {
        await api.put(`/barang/stok/${item.id}`, { stok: parseInt(newStok) });
        Swal.fire('Berhasil!', 'Stok master berhasil disesuaikan.', 'success');
        onRefresh(); 
      } catch (error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan stok.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#EBF3FF] p-6 md:p-8 rounded-3xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <p className="text-[#00AFF0] text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-1">Total Unit Inventaris</p>
          <h3 className="text-3xl md:text-4xl font-black text-blue-900">{totalStokTersisa}</h3>
          <div className="mt-4 px-3 py-1 bg-white text-[#00AFF0] text-[10px] font-bold rounded-lg inline-block shadow-sm">Sisa Stok</div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-1">Barang Masuk</p>
          <h3 className="text-3xl md:text-4xl font-black text-slate-800">+{stats.masuk}</h3>
          <div className="mt-4 px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg inline-block">Total Akumulasi</div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
          <p className="text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-1">Barang Keluar</p>
          <h3 className="text-3xl md:text-4xl font-black text-slate-800">-{stats.keluar}</h3>
          <div className="mt-4 px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg inline-block">Total Akumulasi</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex-1">
        <div className="p-6 md:p-8 flex items-center justify-between gap-3 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-500 rounded-xl"><CheckCircle2 size={20} /></div>
            <h3 className="font-black text-base md:text-lg text-slate-800 tracking-tight">Daftar Ketersediaan Stok Fisik</h3>
          </div>
          {isAdmin && <div className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">Admin Mode</div>}
        </div>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 md:px-10 py-4 text-left">Nama Material</th>
                <th className="px-4 py-4 text-left">Spesifikasi (Merk - Tipe)</th>
                <th className="px-6 py-4 text-right">Stok Gudang</th>
                {isAdmin && <th className="px-6 py-4 text-center w-24">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {materials.length === 0 ? (
                <tr><td colSpan={isAdmin ? "4" : "3"} className="text-center py-8 text-slate-400 font-medium">Dataset masih kosong. Belum ada barang masuk.</td></tr>
              ) : (
                materials.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors font-medium">
                    <td className="px-6 md:px-10 py-5 font-bold text-slate-700">{item.nama}</td>
                    <td className="px-4 py-5 text-slate-500">
                      {item.merk} {item.tipe ? <span className="text-slate-400 ml-1">/ {item.tipe}</span> : ''}
                    </td>
                    <td className="px-6 py-5 text-right font-black text-[#00AFF0] text-base">{item.stok} <span className="text-xs font-semibold text-slate-400 ml-1">{item.satuan || 'unit'}</span></td>
                    {isAdmin && (
                      <td className="px-6 py-5 text-center">
                        <button onClick={() => handleEditStok(item)} className="p-2 text-slate-400 hover:text-[#00AFF0] hover:bg-blue-50 rounded-xl transition-all" title="Koreksi Stok">
                          <Edit size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- HALAMAN TRANSAKSI MASUK ---
const TransaksiMasuk = ({ materials, onAdd }) => {
  const [isManualInput, setIsManualInput] = useState(false); 
  const [form, setForm] = useState({ nama: '', merk: '', tipe: '', tgl: '', jml: '', satuan: 'Buah' }); 

  const namaOptions = [...new Set(materials.map(m => m.nama))].filter(Boolean);
  const merkOptions = [...new Set(materials.filter(m => m.nama === form.nama).map(m => m.merk))].filter(Boolean);
  const tipeOptions = [...new Set(materials.filter(m => m.nama === form.nama && m.merk === form.merk).map(m => m.tipe))].filter(Boolean);

  const handleNamaChange = (e) => setForm({ ...form, nama: e.target.value, merk: '', tipe: '' });
  const handleMerkChange = (e) => setForm({ ...form, merk: e.target.value, tipe: '' });
  const handleTipeChange = (e) => setForm({ ...form, tipe: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, jml: parseInt(form.jml) });
    setForm({ nama: '', merk: '', tipe: '', tgl: '', jml: '', satuan: 'Buah' });
    setIsManualInput(false); 
  };

  return (
    <div className="flex items-center justify-center my-auto flex-1">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-50 pb-4">
          <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-[#00AFF0] rounded-xl"><ArrowDownLeft size={20} /></div>
            Input Barang Masuk
          </h3>
          <button 
            type="button" 
            onClick={() => setIsManualInput(!isManualInput)}
            className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isManualInput ? 'bg-slate-800 text-white border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'}`}
          >
            {isManualInput ? <ToggleLeft size={16} /> : <PlusCircle size={16} />}
            {isManualInput ? "Batal Manual" : "Input Item Baru"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Nama Barang {isManualInput && <span className="text-[#00AFF0]">(Baru)</span>}</label>
            {isManualInput ? (
              <input type="text" required value={form.nama} placeholder="Ketik nama item baru" onChange={e => setForm({...form, nama: e.target.value})} className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700 text-sm" />
            ) : (
              <select required value={form.nama} onChange={handleNamaChange} className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700 cursor-pointer text-sm">
                <option value="" disabled> Pilih Jenis Barang </option>
                {namaOptions.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Merk</label>
              {isManualInput ? (
                 <input type="text" required value={form.merk} placeholder="Ketik merk" onChange={e => setForm({...form, merk: e.target.value})} className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 text-sm" />
              ) : (
                <select required disabled={!form.nama} value={form.merk} onChange={handleMerkChange} className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] disabled:opacity-50 transition-all font-semibold text-slate-700 cursor-pointer text-sm">
                  <option value="" disabled> Pilih Merk </option>
                  {merkOptions.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                </select>
              )}
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Tipe / Spesifikasi</label>
              {isManualInput ? (
                <input type="text" value={form.tipe} placeholder="Kosongkan jika tidak ada" onChange={e => setForm({...form, tipe: e.target.value})} className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 text-sm" />
              ) : (
                <select disabled={!form.merk || tipeOptions.length === 0} value={form.tipe} onChange={handleTipeChange} className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] disabled:opacity-50 transition-all font-semibold text-slate-700 cursor-pointer text-sm">
                  <option value="" disabled>{tipeOptions.length === 0 && form.merk ? '(Tidak ada data spesifikasi)' : ' Pilih Tipe '}</option>
                  {tipeOptions.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Jumlah Masuk</label>
              <input type="number" value={form.jml} required min="1" className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700 text-sm" onChange={e => setForm({...form, jml: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Satuan</label>
              <select value={form.satuan} required className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700 cursor-pointer text-sm" onChange={e => setForm({...form, satuan: e.target.value})}>
                <option value="Buah">Buah</option>
                <option value="Set">Set</option>
                <option value="Pack">Pack</option>
                <option value="Meter">Meter</option>
                <option value="Roll">Roll</option>
                <option value="Pcs">Pcs</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Tgl Diterima</label>
              <input type="date" value={form.tgl} required className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-500 text-sm" onChange={e => setForm({...form, tgl: e.target.value})} />
            </div>
          </div>
          <button className="w-full py-3 md:py-4 bg-[#00AFF0] text-white rounded-xl font-black text-sm md:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all mt-2">Simpan Transaksi Masuk</button>
        </form>
      </div>
    </div>
  );
};

// --- HALAMAN TRANSAKSI KELUAR (MULTI ITEM COMPACT) ---
const TransaksiKeluar = ({ materials, onRemove }) => {
  // General Info (Cukup diisi sekali)
  const [generalForm, setGeneralForm] = useState({ ulp: '', penerima: '', tgl: '' });
  // Daftar Barang (Bisa dinamis / multi-item)
  const [items, setItems] = useState([{ nama: '', merk: '', tipe: '', jml: '', satuan: 'Buah' }]);
  const daftarULP = ["ULP Mattirotasi", "ULP Barru", "ULP Rappang", "ULP Tanrutedong", "ULP Pangsid", "ULP Soppeng", "ULP Pajalesang"];

  const availableMaterials = materials.filter(m => m.stok > 0);

  // Helper untuk dropdown dinamis per baris item
  const getNamaOptions = () => [...new Set(availableMaterials.map(m => m.nama))].filter(Boolean);
  const getMerkOptions = (nama) => [...new Set(availableMaterials.filter(m => m.nama === nama).map(m => m.merk))].filter(Boolean);
  const getTipeOptions = (nama, merk) => [...new Set(availableMaterials.filter(m => m.nama === nama && m.merk === merk).map(m => m.tipe))].filter(Boolean);
  const getMaxStock = (nama, merk, tipe) => {
    const itm = availableMaterials.find(m => m.nama === nama && m.merk === merk && (m.tipe === tipe || (!m.tipe && !tipe)));
    return itm ? itm.stok : 1;
  };

  const handleGeneralChange = (field, value) => {
    setGeneralForm({ ...generalForm, [field]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === 'nama') {
      const itm = availableMaterials.find(m => m.nama === value);
      newItems[index].merk = '';
      newItems[index].tipe = '';
      newItems[index].satuan = itm ? itm.satuan : 'Buah';
    } else if (field === 'merk') {
      const itm = availableMaterials.find(m => m.nama === newItems[index].nama && m.merk === value);
      newItems[index].tipe = '';
      newItems[index].satuan = itm ? itm.satuan : newItems[index].satuan;
    } else if (field === 'tipe') {
      const itm = availableMaterials.find(m => m.nama === newItems[index].nama && m.merk === newItems[index].merk && m.tipe === value);
      newItems[index].satuan = itm ? itm.satuan : newItems[index].satuan;
    }

    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { nama: '', merk: '', tipe: '', jml: '', satuan: 'Buah' }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gabungkan generalForm dan items menjadi array format API untuk dikirim
    const payloads = items.map(item => ({
      ...item,
      jml: parseInt(item.jml),
      ulp: generalForm.ulp,
      penerima: generalForm.penerima,
      tgl: generalForm.tgl
    }));
    
    // Kirim seluruh array barang secara bersamaan
    onRemove(payloads);
    setGeneralForm({ ulp: '', penerima: '', tgl: '' });
    setItems([{ nama: '', merk: '', tipe: '', jml: '', satuan: 'Buah' }]);
  };

  return (
    <div className="flex items-center justify-center my-auto flex-1">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-[#00AFF0] rounded-xl"><ArrowUpRight size={20} /></div>
          <h3 className="text-lg md:text-xl font-black text-slate-800">Form Barang Keluar</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* BAGIAN 1: INFORMASI UMUM (CUKUP SEKALI ISI) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Tujuan ULP Utama</label>
              <select required value={generalForm.ulp} onChange={e => handleGeneralChange('ulp', e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 cursor-pointer text-xs">
                <option value="" disabled> Pilih ULP </option>
                {daftarULP.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Nama Penerima</label>
              <input type="text" required value={generalForm.penerima} placeholder="Nama Petugas..." onChange={e => handleGeneralChange('penerima', e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 text-xs" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Tanggal Pengeluaran</label>
              <input type="date" required value={generalForm.tgl} onChange={e => handleGeneralChange('tgl', e.target.value)} className="w-full p-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-500 text-xs" />
            </div>
          </div>

          {/* BAGIAN 2: DAFTAR BARANG YANG DIKELUARKAN (BISA BANYAK) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between ml-1 mt-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Daftar Barang Keluar</span>
              <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-xs font-bold text-[#00AFF0] hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-all active:scale-95">
                <PlusCircle size={14}/> Tambah Item Lain
              </button>
            </div>
            
            {/* Scroll internal agar form tidak membuat halaman memanjang ke bawah */}
            <div className="max-h-[35vh] overflow-y-auto space-y-2 pr-2">
              {items.map((item, index) => {
                const maxStock = getMaxStock(item.nama, item.merk, item.tipe);
                return (
                  <div key={index} className="flex flex-col md:flex-row gap-2 md:gap-3 items-end bg-white p-3 rounded-xl border border-slate-100 shadow-sm relative">
                    <div className="w-full md:flex-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Barang</label>
                      <select required value={item.nama} onChange={e => handleItemChange(index, 'nama', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 cursor-pointer text-xs">
                        <option value="" disabled>Pilih Barang</option>
                        {getNamaOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="w-full md:flex-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Merk</label>
                      <select required disabled={!item.nama} value={item.merk} onChange={e => handleItemChange(index, 'merk', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] disabled:opacity-50 transition-all font-semibold text-slate-700 cursor-pointer text-xs">
                        <option value="" disabled>Pilih Merk</option>
                        {getMerkOptions(item.nama).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="w-full md:flex-1">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Tipe</label>
                      <select disabled={!item.merk || getTipeOptions(item.nama, item.merk).length === 0} value={item.tipe} onChange={e => handleItemChange(index, 'tipe', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] disabled:opacity-50 transition-all font-semibold text-slate-700 cursor-pointer text-xs">
                        <option value="" disabled>{getTipeOptions(item.nama, item.merk).length === 0 && item.merk ? '-' : 'Pilih Tipe'}</option>
                        {getTipeOptions(item.nama, item.merk).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                    <div className="w-full md:w-20">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block flex justify-between">
                        Jml {item.nama && <span className="text-[#00AFF0]">({maxStock})</span>}
                      </label>
                      <input type="number" required min="1" max={maxStock} value={item.jml} onChange={e => handleItemChange(index, 'jml', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 text-xs" />
                    </div>
                    <div className="w-full md:w-24">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Satuan</label>
                      <select required value={item.satuan} onChange={e => handleItemChange(index, 'satuan', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 cursor-pointer text-xs">
                        <option value="Buah">Buah</option>
                        <option value="Set">Set</option>
                        <option value="Pack">Pack</option>
                        <option value="Meter">Meter</option>
                        <option value="Roll">Roll</option>
                        <option value="Pcs">Pcs</option>
                      </select>
                    </div>
                    {/* Tombol Hapus Baris Item */}
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(index)} className="p-2 mb-[1px] bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-all" title="Hapus Item">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          <button className="w-full py-3 md:py-4 bg-[#00AFF0] text-white rounded-xl font-black text-sm md:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all mt-4">
            Proses Semua Barang Keluar
          </button>
        </form>
      </div>
    </div>
  );
};

// --- HALAMAN HISTORY REPORT ---
const HistoryReport = ({ riwayat }) => {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem('user')) || { name: "Admin Gudang" };

  const toggleSelect = (idStr) => {
    setSelected(prev => prev.includes(idStr) ? prev.filter(i => i !== idStr) : [...prev, idStr]);
  };

  const filtered = riwayat.filter(i => i.nama && i.nama.toLowerCase().includes(search.toLowerCase()));

  const handleDownloadPDF = () => {
    if (selected.length === 0) {
      alert("⚠️ Silakan centang kotak di sebelah kiri tabel terlebih dahulu untuk memilih data.");
      return;
    }

    const defaultFileName = `BAST_Material_PLN_${new Date().toISOString().split('T')[0]}`;
    const userInputFileName = window.prompt("Masukkan nama file PDF untuk disimpan:", defaultFileName);

    if (userInputFileName === null) return;
    const finalFileName = userInputFileName.trim() === "" ? defaultFileName : userInputFileName.trim();

    try {
      const doc = new jsPDF();
      const itemsToPrint = riwayat.filter(m => selected.includes(`${m.jenis}-${m.id}`));
      const firstItem = itemsToPrint[0];
      
      const dateObj = firstItem.tanggal ? new Date(firstItem.tanggal) : new Date();
      const dateStr = dateObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

      let namaUlp = "ULP ....................";
      let namaPenerima = "(Nama Penerima)";
      
      if (firstItem.jenis === 'KELUAR' && firstItem.keterangan) {
        const parts = firstItem.keterangan.split(' - ');
        if (parts.length >= 2) {
          namaUlp = parts[0];       
          namaPenerima = parts[1];  
        } else {
          namaUlp = firstItem.keterangan; 
        }
      } else if (firstItem.jenis === 'MASUK') {
        namaUlp = "GUDANG UTAMA PLN";
        namaPenerima = "Admin Gudang";
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("BERITA ACARA SERAH TERIMA BARANG", 105, 20, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const openingText = `Pada hari ini ${dateStr}. Telah dilaksanakan serah terima barang sebagai berikut :`;
      const textLines = doc.splitTextToSize(openingText, 180);
      doc.text(textLines, 14, 35);

      const tableData = itemsToPrint.map((item, index) => [
        index + 1,
        item.nama || "-",
        item.merk || "-",
        item.tipe || "-",
        item.jumlah,
        item.satuan || "Buah"
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['No', 'Barang', 'Merk', 'Tipe', 'Jumlah', 'Satuan']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
          fillColor: [255, 255, 255], 
          textColor: [0, 0, 0],
          fontStyle: 'bold',
          lineColor: [0, 0, 0],
          lineWidth: 0.2
        },
        styles: { lineColor: [0, 0, 0], lineWidth: 0.2, textColor: [0, 0, 0] }
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      const closingText = "Material tersebut telah diterima dalam keadaan baik dan lengkap. Selanjutnya dapat dipergunakan sebagai sarana pelaksanaan P2TL.";
      const closingLines = doc.splitTextToSize(closingText, 180);
      doc.text(closingLines, 14, finalY);

      const signY = finalY + 25; 
      
      doc.setFont("helvetica", "bold");
      doc.text("PIHAK PENERIMA", 40, signY, { align: "center" });
      doc.text(namaUlp.toUpperCase(), 40, signY + 5, { align: "center" });
      doc.text(namaPenerima.toUpperCase(), 40, signY + 35, { align: "center" });

      doc.text("PIHAK PEMBERI", 170, signY, { align: "center" });
      doc.text("UP3 PAREPARE", 170, signY + 5, { align: "center" });
      doc.text(user.name.toUpperCase(), 170, signY + 35, { align: "center" });

      doc.save(`${finalFileName}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("❌ Gagal membuat dokumen BAST. Silakan cek console browser (F12).");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-[28rem]">
          <Search className="absolute left-4 top-3.5 md:top-4 text-slate-300" size={20} />
          <input type="text" placeholder="Cari riwayat material..." className="w-full pl-12 pr-4 py-3 md:py-4 bg-[#F8FAFC] border border-transparent rounded-xl md:rounded-2xl focus:border-[#00AFF0] focus:bg-white transition-all outline-none text-sm font-semibold text-slate-700" onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button 
          onClick={handleDownloadPDF}
          className={`flex items-center justify-center gap-2 w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${selected.length > 0 ? 'bg-[#00AFF0] text-white hover:shadow-blue-500/40 hover:-translate-y-1' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          <FileDown size={18} /> Cetak BAST ({selected.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex-1">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-4 md:px-6 py-4 text-center w-12 md:w-16"><ListFilter size={16} className="mx-auto" /></th>
                <th className="px-4 md:px-6 py-4 text-slate-600">Tanggal</th>
                <th className="px-4 md:px-6 py-4 text-slate-600">Tipe Transaksi</th>
                <th className="px-4 md:px-6 py-4 text-slate-600">Data Barang</th>
                <th className="px-4 md:px-6 py-4 text-slate-600">Jumlah</th>
                <th className="px-4 md:px-6 py-4 text-slate-600">Keterangan / Tujuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filtered.length === 0 ? (
                 <tr><td colSpan="6" className="text-center py-6 text-slate-400">Belum ada riwayat transaksi.</td></tr>
              ) : (
                filtered.map((item) => {
                  const idStr = `${item.jenis}-${item.id}`; 
                  const isMasuk = item.jenis === 'MASUK';
                  return (
                    <tr key={idStr} className={`${selected.includes(idStr) ? 'bg-blue-50/50' : 'hover:bg-slate-50'} transition-all cursor-pointer`} onClick={() => toggleSelect(idStr)}>
                      <td className="px-4 md:px-6 py-4 text-center">
                        <input type="checkbox" readOnly checked={selected.includes(idStr)} className="w-4 h-4 md:w-5 md:h-5 rounded-lg border-slate-300 text-[#00AFF0]" />
                      </td>
                      <td className="px-4 md:px-6 py-4 text-slate-500 font-bold whitespace-nowrap">{item.tanggal}</td>
                      <td className="px-4 md:px-6 py-4">
                        <span className={`px-2 md:px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black tracking-widest ${isMasuk ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                          {item.jenis}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <div className="font-bold text-slate-800">{item.nama}</div>
                        <div className="text-[10px] md:text-xs text-slate-400">{item.merk} {item.tipe ? `- ${item.tipe}` : ''}</div>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-slate-800 font-black">
                        {isMasuk ? '+' : '-'}{item.jumlah} <span className="text-[10px] md:text-xs font-medium text-slate-500">{item.satuan}</span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-slate-800 text-xs md:text-sm">
                        <span className="font-bold">{item.keterangan}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- HALAMAN MANAJEMEN USER ---
const ManajemenUser = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Staff' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      Swal.fire('Berhasil!', 'Akun user baru telah dibuat.', 'success');
      setForm({ name: '', email: '', password: '', role: 'Staff' });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      Swal.fire('Gagal!', `Gagal membuat akun: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center my-auto flex-1">
      <div className="w-full max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-5 border-b border-slate-50 pb-4">
          <div className="p-2 bg-blue-50 text-[#00AFF0] rounded-xl"><UserPlus size={20} /></div>
          <h3 className="text-lg md:text-xl font-black text-slate-800">Registrasi Akun Baru</h3>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Nama Lengkap</label>
            <input type="text" value={form.name} required className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] font-semibold text-slate-700 text-sm" onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Alamat Email</label>
            <input type="email" value={form.email} required className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] font-semibold text-slate-700 text-sm" onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Password Sementara</label>
              <input type="password" value={form.password} required minLength="6" className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] font-semibold text-slate-700 text-sm" onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Hak Akses (Role)</label>
              <select value={form.role} className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] font-semibold text-slate-700 text-sm cursor-pointer" onChange={e => setForm({...form, role: e.target.value})}>
                <option value="Staff">Staff</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          </div>
          <button disabled={loading} className="w-full py-3 md:py-4 bg-[#00AFF0] text-white rounded-xl font-black text-sm md:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all mt-2">
            {loading ? "Memproses..." : "Buat Akun Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---
function App() {
  const [materials, setMaterials] = useState([]);
  const [riwayatTransaksi, setRiwayatTransaksi] = useState([]); 
  const [stats, setStats] = useState({ masuk: 0, keluar: 0 });

  const fetchDataset = async () => {
    try {
      const response = await api.get('/barang'); 
      const dataDariDatabase = response.data.data || response.data;
      setMaterials(dataDariDatabase);
    } catch (error) {
      console.error("Gagal mengambil data master database", error);
    }
  };

  const fetchHistory = async () => {
    try {
      const resMasuk = await api.get('/transaksi/riwayat-masuk');
      const resKeluar = await api.get('/transaksi/riwayat-keluar');

      const rawMasuk = resMasuk.data.data || [];
      const rawKeluar = resKeluar.data.data || [];

      const totalMasuk = rawMasuk.reduce((sum, item) => sum + (item.jumlah || 0), 0);
      const totalKeluar = rawKeluar.reduce((sum, item) => sum + (item.jumlahKeluar || 0), 0);
      
      setStats({ masuk: totalMasuk, keluar: totalKeluar });

      const dataMasuk = rawMasuk.map(item => ({
        ...item,
        jenis: 'MASUK',
        tanggal: item.tanggal_masuk,
        keterangan: 'Penerimaan Gudang'
      }));

      const dataKeluar = rawKeluar.map(item => ({
        ...item,
        jenis: 'KELUAR',
        tanggal: item.tglKeluar,
        jumlah: item.jumlahKeluar,
        keterangan: `${item.ulp || ''} - ${item.penerima || ''}`
      }));

      const merged = [...dataMasuk, ...dataKeluar].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRiwayatTransaksi(merged);
    } catch (error) {
      console.error("Gagal mengambil riwayat transaksi", error);
    }
  };

  useEffect(() => { 
    fetchDataset(); 
    fetchHistory(); 
  }, []);

  const addStock = async (data) => {
    try {
      await api.post('/transaksi/barang-masuk', {
        nama: data.nama, merk: data.merk, tipe: data.tipe, satuan: data.satuan, jml: data.jml, tgl: data.tgl
      });
      Swal.fire('Berhasil!', 'Transaksi masuk dicatat ke MySQL.', 'success');
      fetchDataset(); 
      fetchHistory(); 
    } catch (error) { 
      Swal.fire('Gagal!', error.response?.data?.message || "Gagal menyimpan.", 'error');
    }
  };

  // Menerima input array dari TransaksiKeluar agar diproses berurutan tanpa error bertumpuk
  const removeStock = async (dataPayloads) => {
    try {
      if (Array.isArray(dataPayloads)) {
        await Promise.all(dataPayloads.map(item => 
          api.post('/transaksi/barang-keluar', {
            nama: item.nama, merk: item.merk, tipe: item.tipe, satuan: item.satuan, 
            jumlahKeluar: item.jml, tglKeluar: item.tgl, penerima: item.penerima, ulp: item.ulp
          })
        ));
        Swal.fire('Berhasil!', 'Semua barang keluar berhasil diproses.', 'success');
      } else {
        // Fallback jika bukan array
        await api.post('/transaksi/barang-keluar', {
          nama: dataPayloads.nama, merk: dataPayloads.merk, tipe: dataPayloads.tipe, satuan: dataPayloads.satuan, 
          jumlahKeluar: dataPayloads.jml, tglKeluar: dataPayloads.tgl, penerima: dataPayloads.penerima, ulp: dataPayloads.ulp
        });
        Swal.fire('Berhasil!', 'Barang keluar berhasil diproses.', 'success');
      }
      fetchDataset(); 
      fetchHistory(); 
    } catch (error) { 
      Swal.fire('Gagal!', error.response?.data?.message || "Stok tidak cukup atau gagal.", 'error');
    }
  };

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'Admin';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={token ? <Layout title="Dashboard"><Dashboard materials={materials} stats={stats} onRefresh={fetchDataset} /></Layout> : <Navigate to="/login" />} />
        <Route path="/barang" element={token ? <Layout title="Laporan History Transaksi"><HistoryReport riwayat={riwayatTransaksi} /></Layout> : <Navigate to="/login" />} />
        <Route path="/transaksi-masuk" element={token ? <Layout title="Penerimaan Stok"><TransaksiMasuk materials={materials} onAdd={addStock} /></Layout> : <Navigate to="/login" />} />
        <Route path="/transaksi-keluar" element={token ? <Layout title="Pengeluaran Stok"><TransaksiKeluar materials={materials} onRemove={removeStock} /></Layout> : <Navigate to="/login" />} />
        
        <Route path="/users" element={
          token && isAdmin ? (
            <Layout title="Manajemen User"><ManajemenUser /></Layout>
          ) : token ? (
            <Navigate to="/" />
          ) : (
            <Navigate to="/login" />
          )
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;