import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Box, ArrowUpRight, ArrowDownLeft, 
  LogOut, Zap, Search, FileDown, 
  ChevronRight, CheckCircle2, ListFilter, Users, UserPlus, Menu, X, Edit, PlusCircle, ToggleLeft,
  UploadCloud, FileText, Download, Trash2, Upload, Camera 
} from 'lucide-react';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Login from './pages/Login';
import api from './services/api'; 

const backendURL = 'http://192.168.100.91:5000'; 

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
          <NavItem to="/arsip-dokumen" icon={UploadCloud} label="Upload Berkas" onClick={() => setIsSidebarOpen(false)} />
          
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-8 mt-6 mb-2">Transaksi</div>
          <NavItem to="/transaksi-masuk" icon={ArrowDownLeft} label="Barang Masuk" onClick={() => setIsSidebarOpen(false)} />
          <NavItem to="/transaksi-keluar" icon={ArrowUpRight} label="Proses Pengeluaran" onClick={() => setIsSidebarOpen(false)} />

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
  const totalStokTersisa = Array.isArray(materials) ? materials.reduce((acc, curr) => acc + (curr.stok || 0), 0) : 0;
  const navigate = useNavigate();

  const handleEditStok = async (item) => {
    const { value: newStok } = await Swal.fire({
      title: `Edit Stok Fisik: ${item.nama}`,
      html: `Merk: <b>${item.merk}</b><br/>Tipe: <b>${item.tipe || '-'}</b>`,
      input: 'number',
      inputLabel: 'Ubah jumlah fisik aktual di gudang (koreksi/opname)',
      inputValue: item.stok,
      showCancelButton: true,
      confirmButtonText: 'Simpan Perubahan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#00AFF0',
      inputValidator: (value) => {
        if (!value || value < 0) return 'Stok tidak boleh kosong atau negatif!';
      }
    });

    if (newStok !== undefined) {
      try {
        await api.put(`/barang/stok/${item.id}`, { stok: parseInt(newStok) });
        Swal.fire('Berhasil!', 'Stok master berhasil dikoreksi.', 'success');
        onRefresh(); 
      } catch (error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan stok.', 'error');
      }
    }
  };

  // FITUR BARU: Handle Hapus Barang di Dashboard
  const handleDeleteStok = async (item) => {
    const result = await Swal.fire({
      title: 'Hapus Data Barang?',
      text: `Anda yakin ingin menghapus "${item.nama}" dari Master Data? Ini akan menghilangkan data barang tersebut dari Dashboard.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/barang/${item.id}`);
        Swal.fire('Terhapus!', 'Data barang berhasil dihapus dari Master Data.', 'success');
        onRefresh(); 
      } catch (error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus barang.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-[#EBF3FF] p-6 md:p-8 rounded-3xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <p className="text-[#00AFF0] text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-1">Total Unit Inventaris</p>
          <h3 className="text-3xl md:text-4xl font-black text-blue-900">{totalStokTersisa}</h3>
          <div className="mt-4 px-3 py-1 bg-white text-[#00AFF0] text-[10px] font-bold rounded-lg inline-block shadow-sm">Real-time (Sisa Stok)</div>
        </div>

        <div onClick={() => navigate('/barang', { state: { filter: 'MASUK' } })} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer hover:-translate-y-1">
          <p className="text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-1">Barang Masuk</p>
          <h3 className="text-3xl md:text-4xl font-black text-slate-800">+{stats.masuk || 0}</h3>
          <div className="mt-4 px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-lg inline-block">Klik Lihat Detail Masuk</div>
        </div>

        <div onClick={() => navigate('/barang', { state: { filter: 'KELUAR' } })} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1 cursor-pointer hover:-translate-y-1">
          <p className="text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-1">Barang Keluar</p>
          <h3 className="text-3xl md:text-4xl font-black text-slate-800">-{stats.keluar || 0}</h3>
          <div className="mt-4 px-3 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-lg inline-block">Klik Lihat Detail Keluar</div>
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
                {isAdmin && <th className="px-6 py-4 text-center w-32">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {!materials || materials.length === 0 ? (
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
                      <td className="px-6 py-5 text-center flex justify-center items-center gap-2">
                        {/* Tombol Edit */}
                        <button onClick={() => handleEditStok(item)} className="p-2 text-slate-400 hover:text-[#00AFF0] hover:bg-blue-50 rounded-xl transition-all" title="Koreksi Stok">
                          <Edit size={18} />
                        </button>
                        {/* Tombol Hapus */}
                        <button onClick={() => handleDeleteStok(item)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Hapus Barang dari Master Data">
                          <Trash2 size={18} />
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
  const [foto, setFoto] = useState(null); 

  const cleanedMaterials = (materials || []).map(item => ({
    ...item,
    nama: item.nama ? item.nama.trim() : '',
    merk: item.merk ? item.merk.trim() : '',
    tipe: item.tipe ? item.tipe.trim() : ''
  }));

  const namaOptions = [...new Set(cleanedMaterials.map(m => m.nama))].filter(Boolean);
  const merkOptions = [...new Set(cleanedMaterials.filter(m => m.nama === form.nama).map(m => m.merk))].filter(Boolean);
  const tipeOptions = [...new Set(cleanedMaterials.filter(m => m.nama === form.nama && m.merk === form.merk).map(m => m.tipe))].filter(Boolean);

  const handleNamaChange = (e) => setForm({ ...form, nama: e.target.value, merk: '', tipe: '' });
  const handleMerkChange = (e) => setForm({ ...form, merk: e.target.value, tipe: '' });
  const handleTipeChange = (e) => setForm({ ...form, tipe: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('nama', form.nama);
    formData.append('merk', form.merk);
    formData.append('tipe', form.tipe);
    formData.append('jml', parseInt(form.jml));
    formData.append('satuan', form.satuan);
    formData.append('tgl', form.tgl);
    if (foto) formData.append('foto', foto);

    onAdd(formData);
    
    setForm({ nama: '', merk: '', tipe: '', tgl: '', jml: '', satuan: 'Buah' });
    setFoto(null);
    if(document.getElementById('fotoUpload')) document.getElementById('fotoUpload').value = ""; 
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

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Upload Foto Barang Fisik (Opsional)</label>
            <input 
                type="file" id="fotoUpload" accept="image/*" 
                onChange={e => setFoto(e.target.files[0])} 
                className="w-full p-2 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#00AFF0] hover:file:bg-blue-100 cursor-pointer" 
              />
          </div>

          <button className="w-full py-3 md:py-4 bg-[#00AFF0] text-white rounded-xl font-black text-sm md:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all mt-2">Simpan Transaksi Masuk</button>
        </form>
      </div>
    </div>
  );
};

// --- HALAMAN TRANSAKSI KELUAR ---
const TransaksiKeluar = ({ materials, onRemove }) => {
  const [generalForm, setGeneralForm] = useState({ ulp: '', penerima: '', tgl: '' });
  const [items, setItems] = useState([{ nama: '', merk: '', tipe: '', jml: '', satuan: 'Buah' }]);
  const daftarULP = ["ULP Mattirotasi", "ULP Barru", "ULP Rappang", "ULP Tanrutedong", "ULP Pangsid", "ULP Soppeng", "ULP Pajalesang"];

  const availableMaterials = (materials || []).filter(m => m.stok > 0).map(item => ({
    ...item,
    nama: item.nama ? item.nama.trim() : '',
    merk: item.merk ? item.merk.trim() : '',
    tipe: item.tipe ? item.tipe.trim() : ''
  }));

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
    if (!generalForm.tgl || !generalForm.penerima || !generalForm.ulp) {
      return Swal.fire('Data Belum Lengkap', 'Harap lengkapi ULP, Penerima, dan Tanggal.', 'warning');
    }
    const payloads = items.map(item => ({
      ...item,
      jml: parseInt(item.jml),
      ulp: generalForm.ulp,
      penerima: generalForm.penerima,
      tgl: generalForm.tgl
    }));
    
    onRemove(payloads);
    setGeneralForm({ ulp: '', penerima: '', tgl: '' });
    setItems([{ nama: '', merk: '', tipe: '', jml: '', satuan: 'Buah' }]);
  };

  return (
    <div className="flex items-center justify-center my-auto flex-1">
      <div className="w-full max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col max-h-[85vh]">
        
        <div className="flex items-center justify-between gap-3 mb-4 border-b border-slate-50 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-[#00AFF0] rounded-xl"><ArrowUpRight size={20} /></div>
            <h3 className="text-lg md:text-xl font-black text-slate-800">Proses Pengeluaran</h3>
          </div>
          <button type="button" onClick={addItem} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border bg-slate-50 text-[#00AFF0] border-[#00AFF0]/20 hover:bg-[#00AFF0] hover:text-white shadow-sm">
            <PlusCircle size={16} /> Tambah Item
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0 mb-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Tujuan ULP Utama</label>
              <select required value={generalForm.ulp} onChange={e => handleGeneralChange('ulp', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 cursor-pointer text-xs md:text-sm">
                <option value="" disabled> Pilih ULP </option>
                {daftarULP.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Nama Penerima</label>
              <input type="text" required value={generalForm.penerima} placeholder="Nama Penerima" onChange={e => handleGeneralChange('penerima', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 text-xs md:text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Tgl Keluar</label>
              <input type="date" required value={generalForm.tgl} onChange={e => handleGeneralChange('tgl', e.target.value)} className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-500 text-xs md:text-sm" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
            {items.map((item, index) => {
              const maxStock = getMaxStock(item.nama, item.merk, item.tipe);
              return (
                <div key={index} className="flex flex-col md:flex-row gap-2 md:gap-3 items-end bg-white p-3 rounded-xl border border-[#00AFF0]/20 shadow-sm relative">
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} title="Hapus Barang Ini" className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <X size={12} />
                    </button>
                  )}
                  <div className="w-full md:flex-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Barang</label>
                    <select required value={item.nama} onChange={e => handleItemChange(index, 'nama', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 cursor-pointer text-xs md:text-sm">
                      <option value="" disabled>Pilih Barang</option>
                      {getNamaOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="w-full md:flex-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Merk</label>
                    <select required disabled={!item.nama} value={item.merk} onChange={e => handleItemChange(index, 'merk', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] disabled:opacity-50 transition-all font-semibold text-slate-700 cursor-pointer text-xs md:text-sm">
                      <option value="" disabled>Pilih Merk</option>
                      {getMerkOptions(item.nama).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="w-full md:flex-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Tipe</label>
                    <select disabled={!item.merk || getTipeOptions(item.nama, item.merk).length === 0} value={item.tipe} onChange={e => handleItemChange(index, 'tipe', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] disabled:opacity-50 transition-all font-semibold text-slate-700 cursor-pointer text-xs md:text-sm">
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
                    <select required value={item.satuan} onChange={e => handleItemChange(index, 'satuan', e.target.value)} className="w-full p-2 bg-[#F8FAFC] border border-transparent rounded-lg outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 cursor-pointer text-xs md:text-sm">
                      <option value="Buah">Buah</option>
                      <option value="Set">Set</option>
                      <option value="Pack">Pack</option>
                      <option value="Meter">Meter</option>
                      <option value="Roll">Roll</option>
                      <option value="Pcs">Pcs</option>
                    </select>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="shrink-0 mt-3 border-t border-slate-50 pt-4">
            <button type="submit" className="w-full py-3.5 bg-[#00AFF0] text-white rounded-xl font-black text-sm md:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all">
              Proses Transaksi Pengeluaran ({items.length} Item)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- HALAMAN HISTORY REPORT ---
const HistoryReport = ({ riwayat, arsip, onRefreshHistory, fetchArsip }) => {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState('SEMUA'); 
  const [sortOrder, setSortOrder] = useState('NEWEST'); 

  const user = JSON.parse(localStorage.getItem('user')) || { name: "Admin Gudang" };
  const isAdmin = user?.role === 'Admin';
  const location = useLocation();

  useEffect(() => {
    if (location.state?.filter) {
      setFilterType(location.state.filter);
    }
  }, [location]);

  const toggleSelect = (idStr) => {
    setSelected(prev => prev.includes(idStr) ? prev.filter(i => i !== idStr) : [...prev, idStr]);
  };

  const filtered = (riwayat || []).filter(i => {
    if (!i) return false;
    if (filterType !== 'SEMUA' && i.jenis !== filterType) return false;
    
    const namaBarang = i.nama || '';
    if (search && !namaBarang.toLowerCase().includes(search.toLowerCase())) return false;
    
    return true;
  }).sort((a, b) => {
    const dateA = new Date(a?.createdAt || a?.tanggal || 0).getTime();
    const dateB = new Date(b?.createdAt || b?.tanggal || 0).getTime();
    return sortOrder === 'NEWEST' ? dateB - dateA : dateA - dateB;
  });

  const handleDownloadPDF = () => {
    if (selected.length === 0) {
      return Swal.fire('Perhatian', 'Silakan centang kotak di sebelah kiri tabel terlebih dahulu.', 'warning');
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
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', lineColor: [0, 0, 0], lineWidth: 0.2 },
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

  const handleUploadRow = async (item) => {
    const { value: file } = await Swal.fire({
      title: 'Upload Dokumen BAST',
      text: `Unggah file PDF untuk transaksi ${item.nama}`,
      input: 'file',
      inputAttributes: { 'accept': 'application/pdf' },
      showCancelButton: true,
      confirmButtonText: 'Upload',
      cancelButtonText: 'Batal'
    });

    if (file) {
      const formData = new FormData();
      formData.append('pdf_file', file);
      formData.append('keterangan', `[TRX-${item.jenis}-${item.id}] BAST ${item.nama}`);
      formData.append('uploader', user.name);

      try {
        await api.post('/arsip/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        Swal.fire('Berhasil!', 'Dokumen BAST telah diunggah dan ditautkan ke riwayat ini.', 'success');
        fetchArsip(); 
      } catch (error) {
        Swal.fire('Gagal!', error.response?.data?.message || 'Gagal mengupload dokumen.', 'error');
      }
    }
  };

  const handleEditRow = async (item) => {
    const { value: formValues } = await Swal.fire({
      title: 'Edit Riwayat Transaksi',
      html: `
        <div class="text-xs text-blue-600 mb-4 bg-blue-50 p-3 rounded-lg text-left border border-blue-200">
          <b>Info Penting:</b> Mengubah jumlah di sini akan <b>OTOMATIS MENYESUAIKAN</b> sisa stok fisik di Gudang (Dashboard) Anda agar selalu sinkron.
        </div>
        <div class="flex flex-col gap-3 text-left">
          <div><label class="text-xs font-bold text-slate-500">Nama Barang</label><input id="swal-nama" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value="${item.nama || ''}"></div>
          <div><label class="text-xs font-bold text-slate-500">Merk</label><input id="swal-merk" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value="${item.merk || ''}"></div>
          <div><label class="text-xs font-bold text-slate-500">Tipe</label><input id="swal-tipe" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value="${item.tipe || ''}"></div>
          <div><label class="text-xs font-bold text-slate-500">Jumlah Cetak BAST</label><input id="swal-jml" type="number" class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none" value="${item.jumlah || ''}"></div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Simpan Perubahan',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        return {
          nama: document.getElementById('swal-nama').value,
          merk: document.getElementById('swal-merk').value,
          tipe: document.getElementById('swal-tipe').value,
          jumlah: document.getElementById('swal-jml').value
        }
      }
    });

    if (formValues) {
      try {
        const endpoint = item.jenis === 'MASUK' ? `/transaksi/masuk/${item.id}` : `/transaksi/keluar/${item.id}`;
        const payload = item.jenis === 'MASUK' 
          ? { nama: formValues.nama, merk: formValues.merk, tipe: formValues.tipe, jumlah: parseInt(formValues.jumlah) }
          : { nama: formValues.nama, merk: formValues.merk, tipe: formValues.tipe, jumlahKeluar: parseInt(formValues.jumlah) };
        
        await api.put(endpoint, payload);
        Swal.fire('Berhasil!', 'Riwayat laporan & Stok berhasil diperbarui.', 'success');
        onRefreshHistory();
      } catch (error) {
        Swal.fire('Gagal!', error.response?.data?.message || 'Gagal memperbarui riwayat.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 w-full">
          <div className="relative w-full sm:w-[20rem]">
            <Search className="absolute left-4 top-3.5 text-slate-300" size={18} />
            <input type="text" placeholder="Cari riwayat..." className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-transparent rounded-xl focus:border-[#00AFF0] focus:bg-white transition-all outline-none text-sm font-semibold text-slate-700" onChange={(e) => setSearch(e.target.value)} />
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button onClick={() => setFilterType('SEMUA')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${filterType === 'SEMUA' ? 'bg-white text-[#00AFF0] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>SEMUA</button>
            <button onClick={() => setFilterType('MASUK')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${filterType === 'MASUK' ? 'bg-green-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>MASUK</button>
            <button onClick={() => setFilterType('KELUAR')} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[11px] font-bold transition-all ${filterType === 'KELUAR' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>KELUAR</button>
          </div>

          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)} 
            className="w-full sm:w-auto px-4 py-2.5 bg-[#F8FAFC] border border-transparent rounded-xl outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-600 cursor-pointer text-xs"
          >
            <option value="NEWEST">Terbaru ke Terlama</option>
            <option value="OLDEST">Terlama ke Terbaru</option>
          </select>
        </div>

        <button 
          onClick={handleDownloadPDF}
          className={`flex items-center justify-center gap-2 w-full lg:w-auto px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 shrink-0 ${selected.length > 0 ? 'bg-[#00AFF0] text-white hover:shadow-blue-500/40 hover:-translate-y-1' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          <FileDown size={18} /> Cetak Draft BAST ({selected.length})
        </button>
      </div>

      <div className="bg-white rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex-1">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm text-left min-w-[900px]">
            <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-4 py-4 text-center w-12"><ListFilter size={16} className="mx-auto" /></th>
                <th className="px-4 py-4">Tanggal</th>
                <th className="px-4 py-4">Tipe</th>
                <th className="px-4 py-4">Data Barang</th>
                <th className="px-4 py-4 text-center">Jumlah</th>
                <th className="px-4 py-4">Keterangan</th>
                <th className="px-4 py-4 text-center">Arsip (Scan BAST)</th>
                {isAdmin && <th className="px-4 py-4 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filtered.length === 0 ? (
                 <tr><td colSpan={isAdmin ? 8 : 7} className="text-center py-8 text-slate-400">Tidak ada data di filter ini.</td></tr>
              ) : (
                filtered.map((item) => {
                  const idStr = `${item.jenis}-${item.id}`; 
                  const isMasuk = item.jenis === 'MASUK';
                  
                  const tagPencarian = `[TRX-${item.jenis}-${item.id}]`;
                  const dataArsip = Array.isArray(arsip) ? arsip : [];
                  const arsipTerkait = dataArsip.find(a => a && a.keterangan && a.keterangan.includes(tagPencarian));

                  return (
                    <tr key={idStr} className={`${selected.includes(idStr) ? 'bg-blue-50/50' : 'hover:bg-slate-50'} transition-all cursor-pointer`} onClick={(e) => { if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A' && e.target.tagName !== 'svg' && e.target.tagName !== 'path' && e.target.tagName !== 'IMG') toggleSelect(idStr); }}>
                      <td className="px-4 py-4 text-center">
                        <input type="checkbox" readOnly checked={selected.includes(idStr)} className="w-4 h-4 rounded-lg text-[#00AFF0]" />
                      </td>
                      <td className="px-4 py-4 text-slate-500 font-bold whitespace-nowrap text-xs">{item.tanggal}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest ${isMasuk ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                          {item.jenis}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-800 text-sm">{item.nama}</div>
                        <div className="text-[10px] text-slate-400">{item.merk} {item.tipe ? `- ${item.tipe}` : ''}</div>
                        
                        {/* FOTO FISIK BARANG DIPINDAHKAN KE SINI (Hanya muncul jika ada foto) */}
                        {isMasuk && item.foto && (
                          <a href={`${backendURL}/uploads/${item.foto}`} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-blue-500 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-all font-bold w-fit" title="Lihat Foto Fisik Barang">
                            <Camera size={10} /> Lihat Foto Barang
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-800 font-black text-center">
                        {isMasuk ? '+' : '-'}{item.jumlah} <span className="text-[9px] font-medium text-slate-500">{item.satuan}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-800 text-xs">
                        <span className="font-bold">{item.keterangan}</span>
                      </td>
                      
                      {/* KOLOM KHUSUS ARSIP SCAN BAST PDF */}
                      <td className="px-4 py-4 text-center">
                        {arsipTerkait ? (
                          <a href={`${backendURL}/uploads/${arsipTerkait.path_file}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 font-bold text-[10px] rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm">
                            <FileText size={12} /> Buka PDF BAST
                          </a>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); handleUploadRow(item); }} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 border border-orange-200 font-bold text-[10px] rounded-lg hover:bg-orange-500 hover:text-white transition-all shadow-sm">
                            <Upload size={12} /> Upload PDF BAST
                          </button>
                        )}
                      </td>

                      {isAdmin && (
                        <td className="px-4 py-4 text-center">
                          <button onClick={(e) => { e.stopPropagation(); handleEditRow(item); }} className="p-1.5 text-slate-400 hover:text-[#00AFF0] hover:bg-blue-50 rounded-lg transition-all" title="Edit Laporan Transaksi">
                            <Edit size={16} />
                          </button>
                        </td>
                      )}
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

// --- HALAMAN ARSIP SCAN PDF ---
const ArsipDokumen = () => {
  const [file, setFile] = useState(null);
  const [keterangan, setKeterangan] = useState('');
  const [arsip, setArsip] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || { name: "Staff" };
  const isAdmin = user?.role === 'Admin'; 

  const backendURL = 'http://192.168.100.91:5000'; 

  const fetchArsip = async () => {
    try {
      const res = await api.get('/arsip');
      setArsip(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Gagal mengambil data arsip", error);
      setArsip([]);
    }
  };

  useEffect(() => { fetchArsip(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      return Swal.fire('Perhatian', 'Pilih file PDF terlebih dahulu!', 'warning');
    }

    const formData = new FormData();
    formData.append('pdf_file', file);
    formData.append('keterangan', keterangan);
    formData.append('uploader', user.name);

    setLoading(true);
    try {
      await api.post('/arsip/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Berhasil!', 'Dokumen BAST berhasil diarsipkan.', 'success');
      setFile(null);
      setKeterangan('');
      document.getElementById('fileUpload').value = ""; 
      fetchArsip();
    } catch (error) {
      Swal.fire('Gagal!', error.response?.data?.message || 'Gagal mengupload dokumen.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, namaFile) => {
    const result = await Swal.fire({
      title: 'Hapus Arsip?',
      text: `Anda yakin ingin menghapus permanen dokumen "${namaFile}"? File fisik juga akan terhapus.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/arsip/${id}`);
        Swal.fire('Terhapus!', 'Arsip dokumen berhasil dihapus.', 'success');
        fetchArsip(); 
      } catch (error) {
        Swal.fire('Gagal!', 'Terjadi kesalahan saat menghapus arsip.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="w-full bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 shrink-0">
        <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-[#00AFF0] rounded-xl"><UploadCloud size={20} /></div>
            <h3 className="text-lg md:text-xl font-black text-slate-800">Upload Dokumen BAST Terpisah</h3>
          </div>
        </div>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Pilih File Scan PDF</label>
              <input 
                type="file" id="fileUpload" accept="application/pdf" 
                onChange={e => setFile(e.target.files[0])} 
                className="w-full p-2 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#00AFF0] hover:file:bg-blue-100 cursor-pointer" 
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Keterangan / Judul Dokumen</label>
              <input 
                type="text" required value={keterangan} 
                placeholder="..." 
                onChange={e => setKeterangan(e.target.value)} 
                className="w-full p-2.5 md:p-3 bg-[#F8FAFC] border-2 border-transparent rounded-xl outline-none focus:border-[#00AFF0] transition-all font-semibold text-slate-700 text-sm" 
              />
            </div>
          </div>
          <button disabled={loading} className="w-full py-3 md:py-4 bg-[#00AFF0] text-white rounded-xl font-black text-sm md:text-base shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-95 transition-all mt-2">
            {loading ? 'Mengunggah Arsip...' : 'Simpan Arsip Dokumen PDF'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex-1 flex flex-col">
        <div className="p-6 md:p-8 flex items-center justify-between gap-3 border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 text-green-500 rounded-xl"><FileText size={20} /></div>
            <h3 className="font-black text-base md:text-lg text-slate-800 tracking-tight">Semua Riwayat Dokumen</h3>
          </div>
        </div>
        <div className="overflow-x-auto w-full flex-1">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left w-16">No</th>
                <th className="px-6 py-4 text-left">Waktu Upload</th>
                <th className="px-6 py-4 text-left">Keterangan / Tag ID</th>
                <th className="px-6 py-4 text-left">Uploader</th>
                <th className="px-6 py-4 text-center">Aksi File</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {!arsip || arsip.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-medium">Belum ada dokumen yang diarsipkan.</td></tr>
              ) : (
                arsip.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors font-medium">
                    <td className="px-6 py-5 text-slate-500">{idx + 1}</td>
                    <td className="px-6 py-5 text-slate-800 font-bold">
                      {new Date(item.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                    </td>
                    <td className="px-6 py-5 text-slate-700">{item.keterangan}</td>
                    <td className="px-6 py-5 text-slate-500">{item.uploader}</td>
                    <td className="px-6 py-5 text-center flex justify-center items-center gap-2">
                      <a href={`${backendURL}/uploads/${item.path_file}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-[#00AFF0] font-bold text-xs rounded-lg hover:bg-[#00AFF0] hover:text-white transition-all shadow-sm">
                        <Download size={14} /> Buka
                      </a>
                      {isAdmin && (
                        <button onClick={() => handleDelete(item.id, item.keterangan)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Hapus Permanen">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
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

// --- MANAJEMEN USER ---
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

// --- APP COMPONENT UTAMA ---
function App() {
  const [materials, setMaterials] = useState([]);
  const [riwayatTransaksi, setRiwayatTransaksi] = useState([]); 
  const [stats, setStats] = useState({ masuk: 0, keluar: 0 });
  const [arsip, setArsip] = useState([]); 

  const fetchDataset = async () => {
    try {
      const response = await api.get('/barang'); 
      const data = response.data?.data || response.data;
      
      if (Array.isArray(data)) {
        const cleanedData = data.map(item => ({
          ...item,
          nama: item.nama ? item.nama.trim() : '',
          merk: item.merk ? item.merk.trim() : '',
          tipe: item.tipe ? item.tipe.trim() : ''
        }));
        setMaterials(cleanedData);
      } else {
        setMaterials([]);
      }
    } catch (error) {
      console.error("Gagal mengambil master", error);
      setMaterials([]);
    }
  };

  const fetchHistory = async () => {
    try {
      const resMasuk = await api.get('/transaksi/riwayat-masuk');
      const resKeluar = await api.get('/transaksi/riwayat-keluar');
      
      const rawMasuk = Array.isArray(resMasuk.data?.data) ? resMasuk.data.data : [];
      const rawKeluar = Array.isArray(resKeluar.data?.data) ? resKeluar.data.data : [];
      
      const totalMasuk = rawMasuk.reduce((sum, item) => sum + (item.jumlah || 0), 0);
      const totalKeluar = rawKeluar.reduce((sum, item) => sum + (item.jumlahKeluar || 0), 0);
      
      setStats({ masuk: totalMasuk, keluar: totalKeluar });

      const dataMasuk = rawMasuk.map(item => ({
        ...item, 
        jenis: 'MASUK', 
        tanggal: item.tanggal_masuk, 
        keterangan: 'Penerimaan Gudang',
        foto: item.foto_bukti 
      }));
      
      const dataKeluar = rawKeluar.map(item => ({
        ...item, 
        jenis: 'KELUAR', 
        tanggal: item.tglKeluar, 
        jumlah: item.jumlahKeluar, 
        keterangan: `${item.ulp || ''} - ${item.penerima || ''}`
      }));

      const merged = [...dataMasuk, ...dataKeluar].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setRiwayatTransaksi(merged);
    } catch (error) {
      console.error("Gagal mengambil riwayat", error);
      setRiwayatTransaksi([]);
    }
  };

  const fetchArsip = async () => {
    try {
      const res = await api.get('/arsip');
      const data = res.data?.data;
      setArsip(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal menarik arsip", error);
      setArsip([]);
    }
  };

  const refreshAllData = () => {
    fetchDataset();
    fetchHistory();
    fetchArsip();
  };

  useEffect(() => { 
    refreshAllData();
  }, []);

  const addStock = async (data) => {
    try {
      await api.post('/transaksi/barang-masuk', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire('Berhasil!', 'Transaksi masuk dicatat ke MySQL.', 'success');
      refreshAllData();
    } catch (error) { 
      Swal.fire('Gagal!', error.response?.data?.message || "Gagal menyimpan.", 'error');
    }
  };

  const removeStock = async (dataPayloads) => {
    try {
      if (Array.isArray(dataPayloads)) {
        await Promise.all(dataPayloads.map(item => 
          api.post('/transaksi/barang-keluar', {
            nama: item.nama, merk: item.merk, tipe: item.tipe, satuan: item.satuan, 
            jumlahKeluar: item.jml, tglKeluar: item.tgl, penerima: item.penerima, ulp: item.ulp
          })
        ));
      } else {
        await api.post('/transaksi/barang-keluar', {
          nama: dataPayloads.nama, merk: dataPayloads.merk, tipe: dataPayloads.tipe, satuan: dataPayloads.satuan, 
          jumlahKeluar: dataPayloads.jml, tglKeluar: dataPayloads.tgl, penerima: dataPayloads.penerima, ulp: dataPayloads.ulp
        });
      }
      Swal.fire('Berhasil!', 'Barang keluar berhasil diproses.', 'success');
      refreshAllData();
    } catch (error) { 
      Swal.fire('Gagal!', error.response?.data?.message || "Stok tidak cukup.", 'error');
    }
  };

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'Admin';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Layout title="Dashboard"><Dashboard materials={materials} stats={stats} onRefresh={refreshAllData} /></Layout> : <Navigate to="/login" />} />
        
        <Route path="/barang" element={token ? <Layout title="Laporan History Transaksi"><HistoryReport riwayat={riwayatTransaksi} arsip={arsip} fetchArsip={fetchArsip} onRefreshHistory={refreshAllData} /></Layout> : <Navigate to="/login" />} />
        
        <Route path="/arsip-dokumen" element={token ? <Layout title="Arsip Scan PDF"><ArsipDokumen /></Layout> : <Navigate to="/login" />} />
        <Route path="/transaksi-masuk" element={token ? <Layout title="Penerimaan Stok"><TransaksiMasuk materials={materials} onAdd={addStock} /></Layout> : <Navigate to="/login" />} />
        <Route path="/transaksi-keluar" element={token ? <Layout title="Pengeluaran Stok"><TransaksiKeluar materials={materials} onRemove={removeStock} /></Layout> : <Navigate to="/login" />} />
        
        <Route path="/users" element={token && isAdmin ? <Layout title="Manajemen User"><ManajemenUser /></Layout> : token ? <Navigate to="/" /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;