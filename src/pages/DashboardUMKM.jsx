import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Activity, ShieldCheck, CheckCircle, 
  Plus, Users, Layers, Check, X, Download, Star, MapPin, AlertCircle, Sparkles, Filter, Store,
  Wallet, CreditCard, QrCode, ArrowUpRight, RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardUMKM() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole') || 'guest';
  const rawUserName = localStorage.getItem('userName');
  const storeName = (isLoggedIn && userRole === 'umkm' && rawUserName) ? rawUserName : 'Kopi Senja (Mitra UMKM)';

  // --- STATE DOMPET DIGITAL (SALDO UMKM & ESCROW) ---
  const [saldoBisnis, setSaldoBisnis] = useState(() => {
    const saved = localStorage.getItem('saldoUMKM');
    return saved ? parseInt(saved) : 2500000;
  });

  const [saldoEscrow, setSaldoEscrow] = useState(() => {
    const saved = localStorage.getItem('saldoEscrow');
    return saved ? parseInt(saved) : 450000;
  });

  const updateSaldoUMKM = (newSaldoBisnis, newEscrow) => {
    setSaldoBisnis(newSaldoBisnis);
    localStorage.setItem('saldoUMKM', newSaldoBisnis);
    if (newEscrow !== undefined) {
      setSaldoEscrow(newEscrow);
      localStorage.setItem('saldoEscrow', newEscrow);
    }
    window.dispatchEvent(new Event('storage'));
  };

  // --- STATE DATA ---
  const [daftarProyekUMKM, setProyekAktif] = useState([
    {
      id: 1,
      judul: "Desain Logo Kedai Kopi",
      tipeKerja: "Sayembara",
      waktu: "Dibuat 1 hari lalu",
      status: "Menunggu Karya",
      budget: 150000,
      isApproved: false,
      kandidatCount: 2
    },
    {
      id: 2,
      judul: "Admin Sosial Media",
      tipeKerja: "Part-Time",
      waktu: "Dibuat 2 jam lalu",
      status: "Mencari Kandidat",
      budget: 300000,
      isApproved: false,
      kandidatCount: 2
    }
  ]);

  // Form Posting
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({ judul: '', tipeKerja: 'Part-Time', budget: '' });

  // --- HELPER FUNCTIONS ---
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(topUpAmount.toString().replace(/\D/g, '')) || 0;
    if (amount < 10000) {
      showToast("Minimal Top Up adalah Rp 10.000", "error");
      return;
    }
    setIsProcessingTopUp(true);
    setTimeout(() => {
      const updated = saldoBisnis + amount;
      updateSaldoUMKM(updated);
      setIsProcessingTopUp(false);
      setShowTopUpModal(false);
      showToast(`Top Up Rp ${amount.toLocaleString('id-ID')} via ${paymentMethod.toUpperCase()} Berhasil!`);
    }, 1000);
  };

  const handlePostingSubmit = (e) => {
    e.preventDefault();
    if (!formData.judul.trim()) {
      setFormError("Judul Pekerjaan tidak boleh kosong!");
      return;
    }
    const cost = parseInt(formData.budget.replace(/\D/g, '')) || 0;
    if (cost <= 0) {
      setFormError("Masukkan anggaran pekerjaan yang valid!");
      return;
    }
    if (cost > saldoBisnis) {
      setFormError(`Saldo UMKM tidak mencukupi! (Saldo Anda: Rp ${saldoBisnis.toLocaleString('id-ID')}). Silakan lakukan Top Up terlebih dahulu.`);
      return;
    }
    setFormError('');
    setShowPostingForm(false);

    // Potong Saldo UMKM dan Alokasikan ke Dana Escrow Rekber
    const newSaldoBisnis = saldoBisnis - cost;
    const newEscrow = saldoEscrow + cost;
    updateSaldoUMKM(newSaldoBisnis, newEscrow);

    setProyekAktif([{
      id: Date.now(),
      judul: formData.judul,
      tipeKerja: formData.tipeKerja.includes('Sayembara') ? 'Sayembara' : 'Part-Time',
      waktu: 'Baru saja',
      status: formData.tipeKerja.includes('Sayembara') ? 'Menunggu Karya' : 'Mencari Kandidat',
      budget: cost,
      isApproved: false,
      kandidatCount: 0
    }, ...daftarProyekUMKM]);

    showToast(`Pekerjaan diposting! Rp ${cost.toLocaleString('id-ID')} dialokasikan ke Dana Escrow Rekber.`);
    setFormData({ judul: '', tipeKerja: 'Part-Time', budget: '' });
  };

  const handleTerimaKandidat = (pelamarName) => {
    setSelectedPortfolio(null);
    setSelectedApplicantsId(null);
    setProyekAktif(daftarProyekUMKM.map(p => p.id === 2 ? { ...p, status: 'Sedang Dikerjakan' } : p));
    showToast(`Berhasil merekrut ${pelamarName}!`);
  };

  const handleApproveProject = (projectId) => {
    const proj = daftarProyekUMKM.find(p => p.id === projectId);
    const amount = proj ? proj.budget : 150000;

    // Cairkan dari Dana Escrow ke Saldo Mahasiswa
    const newEscrow = Math.max(0, saldoEscrow - amount);
    setSaldoEscrow(newEscrow);
    localStorage.setItem('saldoEscrow', newEscrow);

    const currentMahasiswaSaldo = parseInt(localStorage.getItem('saldoMahasiswa')) || 1250000;
    const updatedMahasiswaSaldo = currentMahasiswaSaldo + amount;
    localStorage.setItem('saldoMahasiswa', updatedMahasiswaSaldo);
    window.dispatchEvent(new Event('storage'));

    setProyekAktif(daftarProyekUMKM.map(p => p.id === projectId ? { ...p, status: 'Selesai', isApproved: true } : p));
    showToast(`Karya Disetujui! Rp ${amount.toLocaleString('id-ID')} dicairkan ke Dompet Mahasiswa.`);
  };

  // --- CALCULATIONS ---
  const totalDanaEscrow = (daftarProyekUMKM || []).reduce((acc, p) => p?.isApproved ? acc : acc + (p?.budget || 0), 0);
  const activeProjects = (daftarProyekUMKM || []).filter(p => !p?.isApproved).length;
  const totalKandidat = (daftarProyekUMKM || []).reduce((acc, p) => acc + (p?.kandidatCount || 0), 0);

  // --- STATE MODALS & UI ---
  const [toast, setToast] = useState(null);
  const [showPostingForm, setShowPostingForm] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('100000');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
  const [selectedApplicantsId, setSelectedApplicantsId] = useState(null);
  const [activeApplicantId, setActiveApplicantId] = useState(101);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const [filterTipe, setFilterTipe] = useState('semua');

  // --- DUMMY APPLICANTS DATA ---
  const dummyApplicants = [
    { 
      id: 101, 
      nama: "Andi Saputra", 
      univ: "Universitas Kristen Satya Wacana (UKSW)", 
      jurusan: "S1 Teknik Informatika - Sem 6",
      rating: 4.9, 
      jobsDone: 14, 
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80",
      skills: ["Digital Marketing", "Instagram Manager", "Canva Pro", "Copywriting"],
      pesanLamaran: "Halo Kak! Saya berpengalaman 2 tahun mengelola akun Instagram toko baju & kuliner. Saya bersedia bekerja fleksibel 4 jam/hari sesuai kesepakatan.",
      portfolioImages: [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80",
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&q=80"
      ]
    },
    { 
      id: 102, 
      nama: "Siti Rahmawati", 
      univ: "Universitas Diponegoro (UNDIP)", 
      jurusan: "S1 DKV - Sem 4",
      rating: 4.7, 
      jobsDone: 8, 
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80",
      skills: ["Graphic Design", "Social Media Admin", "Customer Service"],
      pesanLamaran: "Selamat siang! Saya memiliki keahlian dalam membuat konten feed Instagram yang estetis & siap membalas DM pelanggan dengan ramah.",
      portfolioImages: [
        "https://images.unsplash.com/photo-1542744094-3a3172720189?w=400&q=80"
      ]
    }
  ];

  const filteredProyek = (daftarProyekUMKM || []).filter(p => {
    if (filterTipe === 'part-time') return p?.tipeKerja === 'Part-Time';
    if (filterTipe === 'sayembara') return p?.tipeKerja === 'Sayembara';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* TOAST */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
          <div className="bg-slate-900 text-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[300px] border border-slate-800">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="ml-auto text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 py-10">
        
        {/* BANNER PENJELASAN (JIKA BELUM LOGIN SEBAGAI UMKM) */}
        {(!isLoggedIn || userRole !== 'umkm') && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-indigo-500/10 border border-amber-300/60 rounded-3xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl shrink-0 shadow-md">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base mb-0.5">Area Ini Adalah Dasbor Mitra UMKM (Pemberi Kerja)</h4>
                <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
                  Fitur <strong>"Posting Proyek"</strong> digunakan oleh pemilik usaha (UMKM) untuk memasang lowongan pekerjaan baru yang nantinya dilamar oleh mahasiswa.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link to="/lowongan" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5">
                🔍 Saya Mahasiswa (Cari Lowongan)
              </Link>
            </div>
          </div>
        )}

        {/* HERO HEADER CARD FOR UMKM (CLEAN HUMAN SAAS) */}
        <header className="mb-8 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/90 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shrink-0 shadow-xs">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                  Mitra UMKM
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{storeName}</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
                Kelola lowongan proyek, tinjau hasil karya mahasiswa, dan pantau penggunaan anggaran.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowPostingForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Posting Proyek Baru
          </button>
        </header>

        {/* METRIK STATISTIK & E-WALLET UMKM CARDS (CLEAN HUMAN DESIGN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* CARD DOMPET BISNIS UMKM (TOP UP) */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-indigo-100 hover:border-indigo-300 transition flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-indigo-200">
                  CariCuan Pay
                </span>
              </div>
              <h3 className="text-slate-400 font-extrabold text-[11px] uppercase tracking-wider mb-1">Saldo Bisnis (Tersedia)</h3>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Rp {saldoBisnis.toLocaleString('id-ID')}</p>
            </div>

            <button 
              onClick={() => setShowTopUpModal(true)}
              className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Top Up Saldo UMKM
            </button>
          </div>

          {/* CARD DANA REKBER TERKUNCI */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md hover:border-emerald-300 transition duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-emerald-200">
                Rekber Safe
              </span>
            </div>
            <div>
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Dana Rekber Terkunci</h3>
              <p className="text-2xl font-black text-slate-900 tracking-tight">Rp {saldoEscrow.toLocaleString('id-ID')}</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium leading-tight">
                Saldo UMKM yang diamankan sistem untuk pembayaran mahasiswa begitu proyek disetujui.
              </p>
            </div>
          </div>

          {/* CARD PROYEK AKTIF */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md hover:border-indigo-300 transition duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-slate-200">
                Proyek Aktif
              </span>
            </div>
            <div>
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Total Proyek Berjalan</h3>
              <p className="text-3xl font-black text-slate-900">{activeProjects}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Part-Time & Sayembara</p>
            </div>
          </div>

          {/* CARD KANDIDAT MASUK */}
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80 hover:shadow-md hover:border-rose-300 transition duration-300 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                <Users className="w-5 h-5" />
              </div>
              <span className="bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-md border border-amber-200">
                Perlu Ditinjau
              </span>
            </div>
            <div>
              <h3 className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Pelamar & Karya Masuk</h3>
              <p className="text-3xl font-black text-slate-900">{totalKandidat}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Mahasiswa siap kerja</p>
            </div>
          </div>

        </div>

        {/* DAFTAR PROYEK MANAGEMENT SECTION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Manajemen Aktivitas Proyek</h2>
              <p className="text-xs text-slate-500 mt-0.5">Kelola lowongan aktif, seleksi pelamar, dan berikan persetujuan karya</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-stretch sm:self-auto text-xs font-bold">
              <button 
                onClick={() => setFilterTipe('semua')}
                className={`px-3 py-1.5 rounded-lg transition ${filterTipe === 'semua' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Semua Tipe
              </button>
              <button 
                onClick={() => setFilterTipe('part-time')}
                className={`px-3 py-1.5 rounded-lg transition ${filterTipe === 'part-time' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Part-Time
              </button>
              <button 
                onClick={() => setFilterTipe('sayembara')}
                className={`px-3 py-1.5 rounded-lg transition ${filterTipe === 'sayembara' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Sayembara
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredProyek.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">Tidak ada proyek dalam kategori ini.</div>
            ) : (
              filteredProyek.map(proyek => {
                const isSayembara = proyek.tipeKerja === 'Sayembara';
                
                return (
                  <div key={proyek.id} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 transition duration-300 gap-4">
                    
                    {/* Left Info */}
                    <div className="flex gap-4 items-center min-w-0">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isSayembara ? 'bg-pink-100 text-pink-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {isSayembara ? <Layers className="w-7 h-7" /> : <Activity className="w-7 h-7" />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-lg text-slate-900 mb-1 truncate group-hover:text-indigo-600 transition">{proyek.judul}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs font-medium">
                          <span className={`px-2.5 py-0.5 rounded-md font-extrabold ${isSayembara ? 'bg-pink-100 text-pink-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            {proyek.tipeKerja}
                          </span>
                          <span>•</span>
                          <span className="text-slate-600 font-bold">Budget: Rp {proyek.budget.toLocaleString('id-ID')}</span>
                          <span>•</span>
                          <span>{proyek.waktu}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Info & Actions */}
                    <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                      <div className="text-left md:text-right">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status Pekerjaan</span>
                        <span className="block text-xs font-extrabold text-slate-800">{proyek.status}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      {proyek.isApproved ? (
                        <button className="px-6 py-3 bg-slate-200 text-slate-500 font-extrabold rounded-2xl text-xs cursor-not-allowed">
                          ✓ Proyek Selesai
                        </button>
                      ) : isSayembara ? (
                        <button 
                          onClick={() => setSelectedReviewId(proyek.id)}
                          className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold rounded-2xl transition shadow-md flex items-center gap-2 text-xs cursor-pointer relative"
                        >
                          Cek Karya Mahasiswa
                          {proyek.kandidatCount > 0 && (
                            <span className="w-5 h-5 bg-rose-500 text-white flex justify-center items-center rounded-full text-[10px] font-black shadow-sm ring-2 ring-white">
                              {proyek.kandidatCount}
                            </span>
                          )}
                        </button>
                      ) : (
                        <button 
                          onClick={() => setSelectedApplicantsId(proyek.id)}
                          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl transition shadow-md flex items-center gap-2 text-xs cursor-pointer relative"
                        >
                          Lihat Pelamar
                          {proyek.kandidatCount > 0 && (
                            <span className="w-5 h-5 bg-rose-500 text-white flex justify-center items-center rounded-full text-[10px] font-black shadow-sm ring-2 ring-white">
                              {proyek.kandidatCount}
                            </span>
                          )}
                        </button>
                      )}
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* --- MODAL PENERIMAAN / SELEKSI PELAMAR PART-TIME (SINGLE HUB CLEAN UX) --- */}
      {selectedApplicantsId && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    Rekrutmen Part-Time
                  </span>
                  <span className="text-slate-400 text-xs">•</span>
                  <span className="text-xs text-slate-300 font-bold">
                    Proyek: {daftarProyekUMKM.find(p => p.id === selectedApplicantsId)?.judul || 'Admin Sosial Media'}
                  </span>
                </div>
                <h2 className="text-xl font-black">Seleksi & Evaluasi Pelamar Mahasiswa</h2>
              </div>
              <button 
                onClick={() => setSelectedApplicantsId(null)} 
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex justify-center items-center transition text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content Split Pane */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 bg-slate-50">
              
              {/* Left Column: List of Applicants (4 cols) */}
              <div className="lg:col-span-5 p-4 sm:p-5 space-y-3 bg-white">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Daftar Pelamar ({dummyApplicants.length})</h3>
                  <span className="text-[11px] text-indigo-600 font-bold">Pilih untuk detail</span>
                </div>

                {dummyApplicants.map((pelamar) => {
                  const isActive = activeApplicantId === pelamar.id;
                  return (
                    <div 
                      key={pelamar.id} 
                      onClick={() => setActiveApplicantId(pelamar.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-3.5 ${isActive ? 'bg-indigo-50/80 border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'bg-slate-50/70 border-slate-200 hover:bg-slate-50'}`}
                    >
                      <img src={pelamar.avatar} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm" alt="Foto" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-extrabold text-slate-900 text-sm truncate">{pelamar.nama}</h4>
                          <span className="flex items-center text-amber-500 font-extrabold text-xs shrink-0">
                            <Star className="w-3 h-3 mr-1 fill-amber-500" /> {pelamar.rating}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs truncate mb-1">{pelamar.univ}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">
                            {pelamar.jobsDone} Proyek Selesai
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Detailed Candidate View & Action Pane (7 cols) */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-50">
                {(() => {
                  const candidate = dummyApplicants.find(a => a.id === activeApplicantId) || dummyApplicants[0];
                  return (
                    <div className="space-y-6">
                      
                      {/* Candidate Header Profile */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                        <img src={candidate.avatar} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-md shrink-0" alt="Avatar" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-xl font-black text-slate-900">{candidate.nama}</h3>
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Terverifikasi KYC
                            </span>
                          </div>
                          <p className="text-slate-600 text-xs font-medium mb-2">{candidate.jurusan} • {candidate.univ}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                            <span className="flex items-center text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                              <Star className="w-3.5 h-3.5 mr-1 fill-amber-500" /> {candidate.rating} / 5.0
                            </span>
                            <span className="text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                              🏆 {candidate.jobsDone} Selesai di CariCuan
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cover Letter / Pesan Lamaran Box */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          💬 Alasan & Pesan Lamaran Mahasiswa
                        </h4>
                        <p className="text-slate-700 text-xs leading-relaxed italic bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 font-medium">
                          "{candidate.pesanLamaran}"
                        </p>
                      </div>

                      {/* Keahlian / Skills */}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">Keahlian (Skills)</h4>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-white text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200 shadow-2xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Sample Portfolio */}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">Sampel Hasil Kerja / Portofolio</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {candidate.portfolioImages.map((img, i) => (
                            <div key={i} className="h-28 rounded-xl overflow-hidden border border-slate-200 shadow-xs relative group">
                              <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="Portofolio" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recruitment Action Buttons */}
                      <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => {
                            showToast(`Mengirim undangan chat ke ${candidate.nama}...`);
                          }}
                          className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-2xl transition text-xs flex justify-center items-center gap-2 cursor-pointer"
                        >
                          💬 Chat / Interview Mahasiswa
                        </button>

                        <button 
                          onClick={() => handleTerimaKandidat(candidate.nama)}
                          className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl transition text-xs flex justify-center items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Rekrut & Terima {candidate.nama.split(' ')[0]}
                        </button>
                      </div>

                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* --- MODAL CEK KARYA (SAYEMBARA) --- */}
      {selectedReviewId && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h2 className="text-xl font-extrabold text-slate-900">Peninjauan Karya Sayembara</h2>
              <button onClick={() => setSelectedReviewId(null)} className="w-9 h-9 bg-white border border-slate-200 hover:bg-slate-100 rounded-full flex justify-center items-center transition cursor-pointer">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-8 bg-slate-100 flex justify-center items-center">
              {!daftarProyekUMKM.find(p => p.id === selectedReviewId)?.isApproved ? (
                <div className="relative rounded-2xl overflow-hidden shadow-lg w-64 h-64 bg-slate-200 border-2 border-slate-300">
                  <img src="https://images.unsplash.com/photo-1629724888126-17b58c56cc77?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover blur-md grayscale opacity-50" alt="Watermark" />
                  <div className="absolute inset-0 flex flex-col justify-center items-center bg-slate-900/40 backdrop-blur-[2px]">
                    <ShieldCheck className="w-12 h-12 text-white mb-2 drop-shadow-md" />
                    <span className="font-black text-white tracking-widest text-base drop-shadow-md">DRAF WATERMARK</span>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl w-64 h-64 border-4 border-emerald-400">
                  <img src="https://images.unsplash.com/photo-1629724888126-17b58c56cc77?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" alt="Asli" />
                </div>
              )}
            </div>

            <div className="p-6 bg-white">
              {!daftarProyekUMKM.find(p => p.id === selectedReviewId)?.isApproved ? (
                <button 
                  onClick={() => handleApproveProject(selectedReviewId)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-2xl transition flex justify-center items-center text-sm shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <Check className="w-5 h-5 mr-2" /> Setujui Karya & Cairkan Dana Escrow (Rp 150.000)
                </button>
              ) : (
                <button 
                  onClick={() => setSelectedReviewId(null)}
                  className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-4 rounded-2xl transition flex justify-center items-center text-sm shadow-md cursor-pointer"
                >
                  <Download className="w-5 h-5 mr-2" /> Unduh High-Res File (.PNG)
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL POSTING PROYEK BARU --- */}
      {showPostingForm && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h2 className="text-xl font-extrabold text-slate-900">Form Posting Proyek Baru</h2>
              <button onClick={() => setShowPostingForm(false)} className="w-9 h-9 bg-white border border-slate-200 hover:bg-slate-100 rounded-full flex justify-center items-center transition cursor-pointer">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <form onSubmit={handlePostingSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Pekerjaan / Proyek</label>
                  <input 
                    type="text" 
                    value={formData.judul}
                    onChange={e => setFormData({...formData, judul: e.target.value})}
                    placeholder="Misal: Desain Logo & Banner Sosial Media"
                    className={`w-full p-4 bg-slate-50 border ${formError ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-indigo-200'} rounded-2xl outline-none focus:ring-4 transition text-sm font-medium`}
                  />
                  {formError && <p className="text-rose-500 text-xs font-bold mt-2">{formError}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sistem Pekerjaan</label>
                  <select 
                    value={formData.tipeKerja}
                    onChange={e => setFormData({...formData, tipeKerja: e.target.value})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-medium"
                  >
                    <option>Part-Time (Pekerjaan Berdurasi)</option>
                    <option>Sayembara (Lomba Desain / Karya)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Anggaran / Upah (Rp)</label>
                  <input 
                    type="text" 
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                    placeholder="Misal: 250000"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-medium"
                  />
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">Dana akan otomatis dialokasikan ke Escrow Rekber dari Saldo UMKM Anda.</p>
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl transition shadow-lg shadow-indigo-600/20 cursor-pointer text-sm">
                  Posting Sekarang & Alokasikan Rekber
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL TOP UP SALDO UMKM (CARICUAN PAY) --- */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-black text-xs">
                  CariCuan Pay
                </div>
                <div>
                  <h2 className="text-lg font-extrabold">Top Up Saldo UMKM</h2>
                  <p className="text-slate-300 text-xs">Pihak Ketiga Pembayaran Rekber Proyek</p>
                </div>
              </div>
              <button onClick={() => setShowTopUpModal(false)} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex justify-center items-center transition text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleTopUpSubmit} className="space-y-6">
                
                {/* Nominal Quick Choice */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pilih Nominal Top Up</label>
                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    {['50000', '100000', '250000', '500000', '1000000', '2500000'].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setTopUpAmount(amt)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition cursor-pointer ${topUpAmount === amt ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'}`}
                      >
                        Rp {parseInt(amt).toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>

                  <input 
                    type="text"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    placeholder="Nominal Lain (misal: 150000)"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 text-sm font-bold text-slate-800"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Metode Pembayaran Instant</label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    <label 
                      onClick={() => setPaymentMethod('qris')}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${paymentMethod === 'qris' ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <div className="p-2 bg-indigo-600 text-white rounded-xl">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">QRIS Instant</h4>
                        <p className="text-[10px] text-slate-500">GoPay, Shopee, OVO, DANA</p>
                      </div>
                    </label>

                    <label 
                      onClick={() => setPaymentMethod('bca_va')}
                      className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition ${paymentMethod === 'bca_va' ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <div className="p-2 bg-blue-600 text-white rounded-xl">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">BCA Virtual Account</h4>
                        <p className="text-[10px] text-slate-500">Konfirmasi Otomatis 24/7</p>
                      </div>
                    </label>

                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isProcessingTopUp}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-950 text-white font-extrabold rounded-2xl transition shadow-xl text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingTopUp ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" /> Memproses Pembayaran...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 text-emerald-400" /> Bayar & Isi Saldo Sekarang
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}