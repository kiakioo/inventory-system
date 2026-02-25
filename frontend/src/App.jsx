import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Box, ArrowUpRight, ArrowDownLeft, 
  LogOut, User as UserIcon, Zap, Search, FileDown, 
  ChevronRight, CheckCircle2, ListFilter, Users, UserPlus
} from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Login from './pages/Login';
import api from './services/api'; 

// --- KOMPONEN NAVIGASI SIDEBAR (Light Theme) ---
const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center gap-3 px-8 py-4 transition-all duration-200 border-r-4 ${isActive ? 'bg-blue-50/50 text-[#00AFF0] border-[#00AFF0] font-black' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-[#00AFF0] font-semibold'}`}>
      <Icon size={20} className={isActive ? "animate-pulse" : ""} />
      <span className="text-sm">{label}</span>
    </Link>
  );
};

// --- LAYOUT UTAMA ---
const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: "Ashfa Azkianniha", role: "Admin" };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#F4F7FE] font-['Inter'] text-slate-700">
      <aside className="w-72 bg-white flex flex-col shadow-[10px_0_15px_-3px_rgba(0,0,0,0.02)] z-20">
        <div className="p-8 flex flex-col items-center justify-center border-b border-slate-50">
          <div className="w-20 h-20 bg-white rounded-full border border-slate-100 flex items-center justify-center mb-4 shadow-md shadow-blue-900/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50/50"></div>
            <Zap className="text-[#00AFF0] relative z-10" fill="#FFF200" size={36} />
          </div>
          <h2 className="text-xl font-black tracking-tight text-[#00AFF0] uppercase">PLN Inventory</h2>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">UP3 Parepare</p>
        </div>
        
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-8 mb-2">Utama</div>
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/barang" icon={Box} label="Data Material" />
          
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-8 mt-8 mb-2">Transaksi</div>
          <NavItem to="/transaksi-masuk" icon={ArrowDownLeft} label="Barang Masuk" />
          <NavItem to="/transaksi-keluar" icon={ArrowUpRight} label="Proses Pengeluaran" />

          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-8 mt-8 mb-2">Pengaturan</div>
          <NavItem to="/users" icon={Users} label="Manajemen User" />
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-2xl font-bold text-sm transition-all active:scale-95">
            <LogOut size={18} /> Keluar Sistem
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 border-b border-slate-100 z-10">
          <div className="flex items-center gap-3 text-slate-400 text-sm font-medium">
            <span>Aplikasi</span> <ChevronRight size={14} className="text-slate-300" /> <span className="text-[#00AFF0] font-black uppercase tracking-wide">{title}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-slate-800 leading-none">{user.name}</p>
              <p className="text-[10px] text-[#00AFF0] font-bold uppercase mt-1">{user.role}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#00AFF0] shadow-sm font-black text-lg">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-10">{children}</div>
      </main>
    </div>
  );
};

// --- HALAMAN DASHBOARD ---
const Dashboard = ({ materials, stats }) => {
  const aggregatedStock = useMemo(() => {
    const groups = materials.reduce((acc, item) => {
      const name = item.nama ? item.nama.trim() : 'Unknown';
      acc[name] = (acc[name] || 0) + (item.stok || 0);
      return acc;
    }, {});
    return Object.keys(groups).map(name => ({ nama: name, total: groups[name] }));
  }, [materials]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-1">Total Unit Inventaris</p>
          <h3 className="text-4xl font-black text-slate-800">
            {materials.reduce((acc, curr) => acc + (curr.stok || 0), 0)}
          </h3>
          <div className="mt-4 px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg inline-block">Real-time</div>
        </div>
        <div className="bg-[#EBF3FF] p-8 rounded-[2rem] shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <p className="text-[#00AFF0] text-[11px] font-black uppercase tracking-widest mb-1">Barang Masuk (Bulan Ini)</p>
          <h3 className="text-4xl font-black text-blue-900">+{stats.masuk}</h3>
          <div className="mt-4 px-3 py-1 bg-white text-[#00AFF0] text-[10px] font-bold rounded-lg inline-block shadow-sm">Updated</div>
        </div>
        <div className="bg-[#E9FAF0] p-8 rounded-[2rem] shadow-sm border border-green-100 hover:shadow-md transition-shadow">
          <p className="text-green-600 text-[11px] font-black uppercase tracking-widest mb-1">Barang Keluar (Bulan Ini)</p>
          <h3 className="text-4xl font-black text-green-900">-{stats.keluar}</h3>
          <div className="mt-4 px-3 py-1 bg-white text-green-600 text-[10px] font-bold rounded-lg inline-block shadow-sm">Updated</div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-xl"><CheckCircle2 className="text-green-500" size={20} /></div>
          <h3 className="font-black text-lg text-slate-800 tracking-tight">Daftar Ketersediaan Stok</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-10 py-5 text-left">Nama Material</th>
              <th className="px-10 py-5 text-right">Stok Kumulatif</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {aggregatedStock.length === 0 ? (
              <tr><td colSpan="2" className="text-center py-6 text-slate-400">Dataset masih kosong.</td></tr>
            ) : (
              aggregatedStock.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors font-medium">
                  <td className="px-10 py-6 font-bold text-slate-700">{item.nama}</td>
                  <td className="px-10 py-6 text-right font-black text-[#00AFF0] text-base">{item.total} <span className="text-xs font-semibold text-slate-400 ml-1">unit</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- HALAMAN TRANSAKSI MASUK ---
const TransaksiMasuk = ({ materials, onAdd }) => {
  const [form, setForm] = useState({ nama: '', merk: '', tipe: '', tgl: '', jml: '', satuan: 'Buah' }); // Default 'Buah'
  const datasetBarang = [...new Set(materials.map(m => m.nama).filter(Boolean))];
  const datasetMerk = [...new Set(materials.map(m => m.merk).filter(Boolean))];
  const datasetTipe = [...new Set(materials.map(m => m.tipe).filter(Boolean))];

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ ...form, jml: parseInt(form.jml) });
    setForm({ nama: '', merk: '', tipe: '', tgl: '', jml: '', satuan: 'Buah' });
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-3xl bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#00AFF0] rounded-2xl"><ArrowDownLeft size={24} /></div>
          Input Barang Masuk
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Nama Barang</label>
            <input list="list-barang" value={form.nama} placeholder="Ketik atau pilih dari dataset..." required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, nama: e.target.value})} />
            <datalist id="list-barang">{datasetBarang.map((b, idx) => <option key={idx} value={b} />)}</datalist>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Merk</label>
              <input list="list-merk" value={form.merk} placeholder="Contoh: Schneider" required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, merk: e.target.value})} />
              <datalist id="list-merk">{datasetMerk.map((m, idx) => <option key={idx} value={m} />)}</datalist>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Tipe</label>
              <input list="list-tipe" value={form.tipe} placeholder="Contoh: 100kVA" className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, tipe: e.target.value})} />
              <datalist id="list-tipe">{datasetTipe.map((t, idx) => <option key={idx} value={t} />)}</datalist>
            </div>
          </div>
          {/* Baris Baru: Jumlah, Satuan, Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Jumlah Unit</label>
              <input type="number" value={form.jml} required min="1" className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, jml: e.target.value})} />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Satuan</label>
              <select value={form.satuan} required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700 cursor-pointer" onChange={e => setForm({...form, satuan: e.target.value})}>
                <option value="Buah">Buah</option>
                <option value="Set">Set</option>
                <option value="Pack">Pack</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Tanggal Diterima</label>
              <input type="date" value={form.tgl} required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-500" onChange={e => setForm({...form, tgl: e.target.value})} />
            </div>
          </div>
          <button className="w-full py-5 bg-[#00AFF0] text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 transition-all mt-4">Simpan Transaksi Masuk</button>
        </form>
      </div>
    </div>
  );
};

// --- HALAMAN TRANSAKSI KELUAR ---
const TransaksiKeluar = ({ materials, onRemove }) => {
  const [form, setForm] = useState({ nama: '', merk: '', tipe: '', tgl: '', jml: '', penerima: '', ulp: '', satuan: 'Buah' }); // Default 'Buah'
  const datasetBarang = [...new Set(materials.map(m => m.nama).filter(Boolean))];
  const datasetMerk = [...new Set(materials.map(m => m.merk).filter(Boolean))];
  const datasetTipe = [...new Set(materials.map(m => m.tipe).filter(Boolean))];

  const daftarULP = ["ULP Parepare", "ULP Mattirotasi", "ULP Barru", "ULP Pangkep", "ULP Sidrap"];

  const handleSubmit = (e) => {
    e.preventDefault();
    onRemove({ ...form, jml: parseInt(form.jml) });
    setForm({ nama: '', merk: '', tipe: '', tgl: '', jml: '', penerima: '', ulp: '', satuan: 'Buah' });
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] py-8">
      <div className="w-full max-w-3xl bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-[#00AFF0] rounded-2xl"><ArrowUpRight size={24} /></div>
          Form Proses Pengeluaran
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Nama Barang</label>
            <input list="list-barang-out" value={form.nama} required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, nama: e.target.value})} />
            <datalist id="list-barang-out">{datasetBarang.map((b, idx) => <option key={idx} value={b} />)}</datalist>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Merk</label>
              <input list="list-merk-out" value={form.merk} required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, merk: e.target.value})} />
              <datalist id="list-merk-out">{datasetMerk.map((m, idx) => <option key={idx} value={m} />)}</datalist>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Tipe</label>
              <input list="list-tipe-out" value={form.tipe} className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, tipe: e.target.value})} />
              <datalist id="list-tipe-out">{datasetTipe.map((t, idx) => <option key={idx} value={t} />)}</datalist>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Tujuan ULP</label>
              <select value={form.ulp} required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700 cursor-pointer" onChange={e => setForm({...form, ulp: e.target.value})}>
                <option value="" disabled>Pilih ULP...</option>
                {daftarULP.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Nama Penerima</label>
              <input type="text" value={form.penerima} placeholder="Nama Petugas..." required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, penerima: e.target.value})} />
            </div>
          </div>
          {/* Baris Baru: Jumlah, Satuan, Tanggal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Jumlah Keluar</label>
              <input type="number" value={form.jml} required min="1" className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, jml: e.target.value})} />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Satuan</label>
              <select value={form.satuan} required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-700 cursor-pointer" onChange={e => setForm({...form, satuan: e.target.value})}>
                <option value="Buah">Buah</option>
                <option value="Set">Set</option>
                <option value="Pack">Pack</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Tanggal Keluar</label>
              <input type="date" value={form.tgl} required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-[#00AFF0] focus:bg-white transition-all font-semibold text-slate-500" onChange={e => setForm({...form, tgl: e.target.value})} />
            </div>
          </div>
          <button className="w-full py-5 bg-[#00AFF0] text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 active:scale-95 transition-all mt-4">Proses Pengeluaran</button>
        </form>
      </div>
    </div>
  );
};

// --- HALAMAN DATA MATERIAL & REPORT (DENGAN GENERATE PDF) ---
const DataMaterial = ({ materials }) => {
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const user = JSON.parse(localStorage.getItem('user')) || { name: "Admin Gudang" };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filtered = materials.filter(i => i.nama && i.nama.toLowerCase().includes(search.toLowerCase()));

  // Logika Pembuatan Berita Acara Serah Terima PDF
  const handleDownloadPDF = () => {
    if (selected.length === 0) return;
    
    const doc = new jsPDF();
    const itemsToPrint = materials.filter(m => selected.includes(m.id));
    
    const namaPenerima = itemsToPrint[0]?.diterima || "(Nama Penerima)";
    const namaUlp = itemsToPrint[0]?.ulp || "ULP ....................";
    const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Header BAST
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("BERITA ACARA SERAH TERIMA BARANG", 105, 20, { align: "center" });
    
    // Paragraf Pembuka
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const textLines = doc.splitTextToSize(`Pada hari ini ${dateStr}. Telah dilaksanakan serah terima barang sebagai berikut :`, 180);
    doc.text(textLines, 14, 35);

    // MENGAMBIL SATUAN DARI DATA (Bukan lagi hardcode "Unit")
    const tableData = itemsToPrint.map((item, index) => [
      index + 1,
      item.nama || "-",
      item.merk || "-",
      item.tipe || "-",
      item.stok || item.jumlahKeluar || 0,
      item.satuan || "Buah" // <--- Satuan diambil otomatis dari data
    ]);

    // Membuat Tabel PDF
    doc.autoTable({
      startY: 45,
      head: [['No', 'Barang', 'Merk', 'Tipe', 'Jumlah', 'Satuan']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 175, 240] } // Biru PLN
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Paragraf Penutup
    doc.text("Material tersebut telah diterima dalam keadaan baik dan lengkap. Selanjutnya dapat dipergunakan sebagai sarana pelaksanaan P2TL.", 14, finalY, { maxWidth: 180 });

    // Area Tanda Tangan
    const signY = finalY + 25;
    
    doc.setFont("helvetica", "bold");
    doc.text("PIHAK PENERIMA", 40, signY, { align: "center" });
    doc.text(namaUlp.toUpperCase(), 40, signY + 5, { align: "center" });
    
    doc.text(namaPenerima, 40, signY + 35, { align: "center" });
    doc.line(20, signY + 36, 60, signY + 36);

    doc.text("PIHAK PEMBERI", 170, signY, { align: "center" });
    doc.text("UP3 PAREPARE", 170, signY + 5, { align: "center" });
    
    doc.text(user.name.toUpperCase(), 170, signY + 35, { align: "center" });
    doc.line(150, signY + 36, 190, signY + 36);

    doc.save(`BAST_Barang_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
        <div className="relative w-full md:w-[28rem]">
          <Search className="absolute left-5 top-4 text-slate-300" size={20} />
          <input type="text" placeholder="Pencarian material..." className="w-full pl-14 pr-4 py-4 bg-[#F8FAFC] border border-transparent rounded-2xl focus:border-[#00AFF0] focus:bg-white transition-all outline-none text-sm font-semibold text-slate-700" onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button 
          onClick={handleDownloadPDF}
          className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-lg active:scale-95 ${selected.length > 0 ? 'bg-[#00AFF0] text-white hover:shadow-blue-500/40 hover:-translate-y-1' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          <FileDown size={18} /> Download Dokumen BAST ({selected.length})
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-6 py-6 text-center w-16"><ListFilter size={16} className="mx-auto" /></th>
              <th className="px-6 py-6 text-slate-600">Nama Barang</th>
              <th className="px-6 py-6 text-slate-600">Merk</th>
              <th className="px-6 py-6 text-slate-600">Tipe</th>
              <th className="px-6 py-6 text-slate-600">Satuan</th>
              <th className="px-6 py-6 text-slate-600">Penerima</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium">
            {filtered.length === 0 ? (
               <tr><td colSpan="6" className="text-center py-6 text-slate-400">Tidak ada data.</td></tr>
            ) : (
              filtered.map((item, idx) => (
                <tr key={item.id || idx} className={`${selected.includes(item.id) ? 'bg-blue-50/50' : 'hover:bg-slate-50'} transition-all cursor-pointer`} onClick={() => toggleSelect(item.id)}>
                  <td className="px-6 py-6 text-center">
                    <input type="checkbox" readOnly checked={selected.includes(item.id)} className="w-5 h-5 rounded-lg border-slate-300 text-[#00AFF0] focus:ring-[#00AFF0]" />
                  </td>
                  <td className="px-6 py-6 font-bold text-slate-800">{item.nama}</td>
                  <td className="px-6 py-6 text-slate-500">{item.merk || '-'}</td>
                  <td className="px-6 py-6 text-slate-500 italic">{item.tipe || '-'}</td>
                  <td className="px-6 py-6 text-slate-500 font-bold">{item.satuan || 'Buah'}</td>
                  <td className="px-6 py-6 text-slate-800">
                    <span className="font-bold">{item.ulp || '-'}</span> <br/>
                    <span className="text-xs text-slate-400 font-normal">{item.diterima || '-'}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
      alert('Berhasil! Akun user baru telah dibuat.');
      setForm({ name: '', email: '', password: '', role: 'Staff' });
    } catch (error) {
      console.error(error);
      alert('Gagal membuat akun. Pastikan email belum pernah terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh]">
      <div className="w-full max-w-2xl bg-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl"><UserPlus size={24} /></div>
          Registrasi Akun Baru
        </h3>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Nama Lengkap</label>
            <input type="text" value={form.name} placeholder="Nama personil..." required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-purple-400 focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Alamat Email</label>
            <input type="email" value={form.email} placeholder="email@pln.co.id" required className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-purple-400 focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Password Sementara</label>
              <input type="password" value={form.password} placeholder="Minimal 6 karakter" required minLength="6" className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-purple-400 focus:bg-white transition-all font-semibold text-slate-700" onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-2 mb-2 block">Hak Akses (Role)</label>
              <select value={form.role} className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl outline-none focus:border-purple-400 focus:bg-white transition-all font-semibold text-slate-700 cursor-pointer" onChange={e => setForm({...form, role: e.target.value})}>
                <option value="Staff">Staff Gudang</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          </div>
          <button disabled={loading} className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 active:scale-95 transition-all mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
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
  const [stats, setStats] = useState({ masuk: 0, keluar: 0 });

  const fetchDataset = async () => {
    try {
      const response = await api.get('/barang'); 
      const dataDariDatabase = response.data.data || response.data;
      setMaterials(dataDariDatabase);
      const countMasuk = dataDariDatabase.reduce((acc, curr) => acc + (curr.stok || 0), 0);
      setStats({ masuk: countMasuk, keluar: 0 }); 
    } catch (error) {
      console.error("Gagal mengambil data database", error);
    }
  };

  useEffect(() => { fetchDataset(); }, []);

  const addStock = async (data) => {
    try {
      await api.post('/barang', {
        nama: data.nama, merk: data.merk, tipe: data.tipe, satuan: data.satuan, stok: data.jml, tglMasuk: data.tgl, diterima: 'Gudang Utama'
      });
      alert("Berhasil menyimpan ke Database!");
      fetchDataset(); 
    } catch (error) { alert("Gagal menyimpan ke Database."); }
  };

  const removeStock = async (data) => {
    try {
      await api.post('/barang-keluar', {
        nama: data.nama, merk: data.merk, tipe: data.tipe, satuan: data.satuan, jumlahKeluar: data.jml, tglKeluar: data.tgl, penerima: data.penerima, ulp: data.ulp
      });
      alert("Pengeluaran barang berhasil diproses ke Database!");
      fetchDataset(); 
    } catch (error) { alert("Gagal memproses barang keluar."); }
  };

  const token = localStorage.getItem('token');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={token ? <Layout title="Dashboard"><Dashboard materials={materials} stats={stats} /></Layout> : <Navigate to="/login" />} />
        <Route path="/barang" element={token ? <Layout title="Data Material"><DataMaterial materials={materials} /></Layout> : <Navigate to="/login" />} />
        <Route path="/transaksi-masuk" element={token ? <Layout title="Penerimaan Stok"><TransaksiMasuk materials={materials} onAdd={addStock} /></Layout> : <Navigate to="/login" />} />
        <Route path="/transaksi-keluar" element={token ? <Layout title="Pengeluaran Stok"><TransaksiKeluar materials={materials} onRemove={removeStock} /></Layout> : <Navigate to="/login" />} />
        <Route path="/users" element={token ? <Layout title="Manajemen User"><ManajemenUser /></Layout> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;