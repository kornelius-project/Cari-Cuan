import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Clock, User, ChevronRight, TrendingUp, AlertCircle, 
  ArrowDownLeft, ArrowUpRight, CheckCircle2, Wallet, X, Lock, Star,
  ShieldCheck, ArrowRight, Zap, Sparkles, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardMahasiswa() {
  const [kycVerified, setKycVerified] = useState(false);
  const [saldo, setSaldo] = useState(() => {
    const saved = localStorage.getItem('saldoMahasiswa');
    return saved ? parseInt(saved) : 1250000;
  });
  const [showModal, setShowModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(1);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [filterTrx, setFilterTrx] = useState('semua');
  
  const [riwayatData, setRiwayatData] = useState([
    { id: 1, jenis: "Masuk", judul: "Upah: Admin Sosial Media Instagram", tanggal: "17 Juli 2026", nominal: "+ Rp 300.000", status: "Selesai", umkm: "Butik Nabila" },
    { id: 2, jenis: "Keluar", judul: "Penarikan ke Bank BCA", tanggal: "15 Juli 2026", nominal: "- Rp 300.000", status: "Berhasil", bank: "BCA •••• 5678" },
    { id: 3, jenis: "Masuk", judul: "Upah: Sebar 100 Brosur Area UKSW", tanggal: "10 Juli 2026", nominal: "+ Rp 100.000", status: "Selesai", umkm: "Bimbel Juara" },
  ]);

  useEffect(() => {
    if (localStorage.getItem('kycVerified') === 'true') {
      setKycVerified(true);
    }
    const handleStorage = () => {
      const saved = localStorage.getItem('saldoMahasiswa');
      if (saved) setSaldo(parseInt(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleWithdrawClick = () => {
    if (!kycVerified) {
      alert("Silakan lengkapi verifikasi KYC di halaman Profil terlebih dahulu sebelum menarik dana.");
      return;
    }
    if (saldo <= 0) {
      alert("Saldo Anda Rp 0. Tidak ada dana yang bisa ditarik saat ini.");
      return;
    }
    setWithdrawStep(1);
    setWithdrawAmount('');
    setPin(['', '', '', '', '', '']);
    setShowModal(true);
  };

  const handleNextStep = () => {
    const amount = parseInt(withdrawAmount.replace(/\D/g, '')) || 0;
    if (amount < 10000) {
      alert("Minimal penarikan adalah Rp 10.000");
      return;
    }
    if (amount > saldo) {
      alert("Saldo tidak mencukupi!");
      return;
    }
    setWithdrawStep(2);
  };

  const handlePinChange = (index, value) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    if (index === 5 && value !== '') {
      processWithdrawal(parseInt(withdrawAmount.replace(/\D/g, '')));
    } else if (value !== '' && index < 5) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const processWithdrawal = (amount) => {
    setIsWithdrawing(true);
    setTimeout(() => {
      const newSaldo = Math.max(0, saldo - amount);
      setSaldo(newSaldo);
      localStorage.setItem('saldoMahasiswa', newSaldo);
      window.dispatchEvent(new Event('storage'));

      const newTrx = {
        id: Date.now(),
        jenis: "Keluar",
        judul: "Penarikan ke Bank BCA / E-Wallet",
        tanggal: "Hari ini",
        nominal: `- Rp ${amount.toLocaleString('id-ID')}`,
        status: "Berhasil",
        bank: "BCA •••• 5678"
      };
      setRiwayatData([newTrx, ...riwayatData]);
      setIsWithdrawing(false);
      setWithdrawStep(3);
    }, 1200);
  };

  const filteredRiwayat = riwayatData.filter(trx => {
    if (filterTrx === 'masuk') return trx.jenis === 'Masuk';
    if (filterTrx === 'keluar') return trx.jenis === 'Keluar';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 py-10">
        
        {/* HERO HEADER CARD FOR MAHASISWA (CLEAN HUMAN SAAS) */}
        <header className="mb-8 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/90 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shrink-0 shadow-xs">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Mahasiswa UKSW
                </span>
                {kycVerified && (
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Terverifikasi
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Dasbor Keuangan Mahasiswa</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
                Pantau pendapatan hasil proyek freelance Anda dan kelola penarikan saldo ke bank/e-wallet.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link 
              to="/lowongan" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-3 rounded-xl shadow-xs transition flex items-center gap-2 text-xs sm:text-sm"
            >
              <Briefcase className="w-4 h-4" /> Cari Pekerjaan
            </Link>
            <Link 
              to="/profil" 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold px-5 py-3 rounded-xl border border-slate-200 transition flex items-center gap-2 text-xs sm:text-sm"
            >
              <User className="w-4 h-4" /> Profil Saya
            </Link>
          </div>
        </header>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* FINTECH WALLET CARD (CLEAN HUMAN DESIGN) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-indigo-100/90 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-slate-400 font-extrabold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-indigo-600" /> Saldo Dompet Mahasiswa
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                    Rp {saldo.toLocaleString('id-ID')}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Siap dicairkan ke bank atau e-wallet (GoPay, OVO, DANA)
                  </p>
                </div>

                <button 
                  onClick={handleWithdrawClick}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" /> Tarik Saldo Ke Bank
                </button>
              </div>

              {/* Secondary Stats Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Garansi Rekber Proyek</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-amber-200">Proses Kerja</span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">Rp 150.000</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Otomatis cair setelah karya disetujui UMKM</p>
                </div>

                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Penghasilan</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200">Akumulasi</span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">Rp 400.000</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Hasil kerja dari 3 proyek selesai</p>
                </div>
              </div>
            </div>

            {/* TRANSACTIONS SECTION */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Riwayat Mutasi Saldo</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Catatan seluruh transaksi masuk dan keluar</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl gap-1 self-stretch sm:self-auto text-xs font-bold">
                  <button 
                    onClick={() => setFilterTrx('semua')}
                    className={`px-3 py-1.5 rounded-lg transition ${filterTrx === 'semua' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Semua
                  </button>
                  <button 
                    onClick={() => setFilterTrx('masuk')}
                    className={`px-3 py-1.5 rounded-lg transition ${filterTrx === 'masuk' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Pemasukan
                  </button>
                  <button 
                    onClick={() => setFilterTrx('keluar')}
                    className={`px-3 py-1.5 rounded-lg transition ${filterTrx === 'keluar' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Penarikan
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                {filteredRiwayat.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-sm">Tidak ada transaksi ditemukan.</div>
                ) : (
                  filteredRiwayat.map((trx) => {
                    const isMasuk = trx.jenis === 'Masuk';
                    return (
                      <div 
                        key={trx.id} 
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition duration-200 flex items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isMasuk ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {isMasuk ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-indigo-600 transition">{trx.judul}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                              <span>{trx.tanggal}</span>
                              <span>•</span>
                              <span className="flex items-center text-emerald-600 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {trx.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-base sm:text-lg font-black ${isMasuk ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {trx.nominal}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* PROFIL / KYC CARD STATUS */}
            {kycVerified ? (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="bg-emerald-200/60 text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">Status KYC</span>
                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">Identitas Terverifikasi</h3>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">Akun Anda memenuhi syarat pencairan dana otomatis 24/7.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="bg-amber-200/60 text-amber-900 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">Perlu Tindakan</span>
                    <h3 className="font-extrabold text-slate-900 text-lg mt-1">Verifikasi KYC Mahasiswa</h3>
                    <p className="text-slate-600 text-xs mt-1 leading-relaxed">Upload KTM & No. Rekening untuk mengaktifkan fitur penarikan tunai.</p>
                  </div>
                </div>
                <Link to="/profil" className="block w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-center font-extrabold py-3 rounded-2xl transition shadow-md text-sm">
                  Lengkapi Verifikasi
                </Link>
              </div>
            )}

            {/* ACTIVE WORKSPACE CARD */}
            <div 
              onClick={() => window.location.href='/proyek-aktif'}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition duration-300 group cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-extrabold px-3 py-1 rounded-full border border-indigo-200">
                  1 Proyek Aktif
                </span>
              </div>

              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ruang Kerja Mahasiswa</span>
              <h3 className="font-extrabold text-slate-900 text-lg mt-0.5 group-hover:text-indigo-600 transition">
                Desain Logo & Kemasan Kopi
              </h3>
              <p className="text-slate-500 text-xs mt-1 mb-4">UMKM: Kopi Senja • Deadline: 2 Hari lagi</p>
              
              {/* Mini Progress */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-indigo-600 h-full rounded-full w-3/4"></div>
              </div>

              <div className="flex items-center text-indigo-600 font-extrabold text-xs group-hover:translate-x-1 transition transform">
                Buka Ruang Kerja & Kirim Draf <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* PROMO / QUICK JOB SEARCH CTA WITH FREELANCE IMAGE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="h-40 relative">
                <img src="/freelance.jpg" alt="Freelance Mahasiswa" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <span className="absolute bottom-3 left-4 text-white text-[10px] font-black uppercase tracking-wider bg-indigo-600 px-2.5 py-1 rounded-md shadow-xs">
                  Freelance Work
                </span>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-extrabold text-lg text-slate-900 mb-1">Butuh Cuan Tambahan?</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  Ada puluhan proyek dari UMKM Salatiga & sekitarnya yang pas dengan jadwal kuliah Anda.
                </p>
                <Link 
                  to="/lowongan" 
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl shadow-xs transition text-xs"
                >
                  Jelajahi Lowongan Baru
                </Link>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* MODAL TARIK TUNAI PROFESIONAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 relative">
            
            {/* Modal Header */}
            <div className={`p-6 text-white flex justify-between items-center transition-colors duration-500 ${withdrawStep === 3 ? 'bg-emerald-600' : 'bg-gradient-to-r from-indigo-900 to-slate-900'}`}>
              <h3 className="font-extrabold text-lg flex items-center">
                {withdrawStep === 1 && <><Wallet className="w-5 h-5 mr-2" /> Penarikan Dana Ke Bank</>}
                {withdrawStep === 2 && <><Lock className="w-5 h-5 mr-2" /> Konfirmasi PIN Keamanan</>}
                {withdrawStep === 3 && <><CheckCircle2 className="w-5 h-5 mr-2" /> Penarikan Berhasil</>}
              </h3>
              {withdrawStep !== 3 && (
                <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-2 rounded-full transition cursor-pointer" disabled={isWithdrawing}>
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* STEP 1: INPUT NOMINAL */}
            {withdrawStep === 1 && (
              <div className="p-6 sm:p-8 animate-in slide-in-from-right-4 duration-300">
                <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center gap-4">
                  <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center shrink-0">
                    <span className="font-black text-indigo-900 text-xs tracking-widest">BCA</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold">Rekening Tujuan</p>
                    <p className="text-sm font-extrabold text-indigo-950">Bank BCA •••• 5678</p>
                    <p className="text-xs text-indigo-700">a.n Kornelius Candra</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nominal Penarikan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">Rp</span>
                    <input 
                      type="text" 
                      value={withdrawAmount}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setWithdrawAmount(val ? parseInt(val).toLocaleString('id-ID') : '');
                      }}
                      placeholder="0"
                      className="w-full pl-12 pr-4 py-4 text-2xl font-black bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition" 
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 px-1">
                    <p className="text-xs text-slate-500">Saldo: Rp {saldo.toLocaleString('id-ID')}</p>
                    <button onClick={() => setWithdrawAmount(saldo.toLocaleString('id-ID'))} className="text-xs font-bold text-indigo-600 hover:underline">Tarik Semua</button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Biaya Transfer</span>
                    <span className="font-bold text-emerald-600">Gratis (Promo Mahasiswa)</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-200/60">
                    <span className="text-slate-700 font-bold">Total Diterima</span>
                    <span className="font-extrabold text-slate-900">Rp {withdrawAmount || '0'}</span>
                  </div>
                </div>

                <button 
                  onClick={handleNextStep}
                  disabled={!withdrawAmount || parseInt(withdrawAmount.replace(/\D/g, '')) <= 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Konfirmasi Penarikan
                </button>
              </div>
            )}

            {/* STEP 2: VERIFIKASI PIN */}
            {withdrawStep === 2 && (
              <div className="p-8 text-center animate-in slide-in-from-right-4 duration-300">
                <div className="bg-indigo-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  <Lock className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-xl text-slate-900 mb-2">Masukkan PIN Transaksi</h4>
                <p className="text-slate-500 text-xs mb-8">Masukkan 6 digit PIN untuk otorisasi penarikan Rp {withdrawAmount}.</p>
                
                <div className="flex justify-center gap-2 mb-8">
                  {pin.map((p, i) => (
                    <input 
                      key={i}
                      id={`pin-${i}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={p}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      disabled={isWithdrawing}
                      className="w-11 h-13 text-center text-xl font-black bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
                    />
                  ))}
                </div>

                {isWithdrawing && (
                  <div className="flex items-center justify-center text-indigo-600 font-bold text-sm animate-pulse">
                    <div className="w-5 h-5 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Memproses Transfer ke Bank BCA...
                  </div>
                )}
                
                {!isWithdrawing && (
                  <button onClick={() => setWithdrawStep(1)} className="text-xs font-bold text-slate-400 hover:text-slate-700">
                    Kembali
                  </button>
                )}
              </div>
            )}

            {/* STEP 3: SUCCESS RECEIPT */}
            {withdrawStep === 3 && (
              <div className="p-8 text-center animate-in zoom-in duration-300">
                <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-emerald-600 shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-extrabold text-2xl text-slate-900 mb-1">Penarikan Berhasil!</h4>
                <p className="text-slate-500 text-xs mb-6">Dana sebesar <b>Rp {withdrawAmount}</b> langsung diproses ke rekening Bank BCA Anda.</p>
                
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left mb-6 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">No. Referensi</span>
                    <span className="font-mono font-bold text-slate-800">TRX-{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold">Waktu</span>
                    <span className="font-bold text-slate-800">{new Date().toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full bg-slate-900 text-white font-extrabold py-4 rounded-2xl shadow-md hover:bg-slate-950 transition cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}