import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Clock, User, ChevronRight, AlertCircle, 
  ArrowDownLeft, ArrowUpRight, CheckCircle2, Wallet, X, Lock,
  ShieldCheck, Zap, Sparkles, GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardMahasiswa() {
  const [kycVerified, setKycVerified] = useState(false);
  const [userId] = useState(() => localStorage.getItem('userId') || '');
  
  const [saldo, setSaldo] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState(1);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [filterTrx, setFilterTrx] = useState('semua');
  const [riwayatData, setRiwayatData] = useState([]);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:5000/api/wallet', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSaldo(data.balance);
        setRiwayatData(data.transactions);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setKycVerified(user.kycStatus === 'VERIFIED');
    }
    fetchWallet();
    const handleStorage = () => {
      fetchWallet();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleWithdrawClick = () => {
    if (!kycVerified) {
      alert("Silakan lengkapi verifikasi KYC terlebih dahulu sebelum menarik dana.");
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

  const processWithdrawal = async (amount) => {
    setIsWithdrawing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/wallet/withdraw', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      if (response.ok) {
        await fetchWallet();
        setIsWithdrawing(false);
        setWithdrawStep(3);
        window.dispatchEvent(new Event('storage'));
      } else {
        const data = await response.json();
        alert(data.error || 'Penarikan gagal');
        setIsWithdrawing(false);
      }
    } catch (error) {
      alert('Terjadi kesalahan server');
      setIsWithdrawing(false);
    }
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
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-xs">
              <User className="w-7 h-7" />
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
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition flex items-center gap-2 text-xs sm:text-sm border border-slate-800"
            >
              <Briefcase className="w-4 h-4" /> Cari Pekerjaan
            </Link>
            <Link 
              to="/profil" 
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-lg border border-slate-200 transition flex items-center gap-2 text-xs sm:text-sm shadow-sm"
            >
              <User className="w-4 h-4 text-slate-500" /> Profil Saya
            </Link>
          </div>
        </header>

        {/* TOP STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Main Wallet Card */}
          <div className="md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Background Graphic */}
            <div className="absolute -bottom-10 -right-10 opacity-20 pointer-events-none">
              <Wallet className="w-64 h-64 transform -rotate-12" />
            </div>
            
            <div className="relative z-10">
              <p className="text-slate-300 font-semibold text-xs sm:text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                Saldo Tersedia <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
                Rp {saldo.toLocaleString('id-ID')}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm">Siap ditarik kapan saja ke Rekening Bank atau E-Wallet.</p>
            </div>

            <div className="relative z-10 mt-8">
              <button 
                onClick={handleWithdrawClick}
                className="inline-flex bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl shadow-md transition items-center gap-2 text-sm"
              >
                <Zap className="w-5 h-5" /> Tarik Tunai
              </button>
            </div>
          </div>

          {/* Side Cards: KYC & Escrow */}
          <div className="flex flex-col gap-6">
            {kycVerified ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-emerald-950 text-base">Akun Terverifikasi</h3>
                    <p className="text-emerald-700 text-xs font-medium">Bebas penarikan dana 24/7.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-amber-950 text-base leading-tight">Verifikasi KYC<br/>Belum Lengkap</h3>
                  </div>
                </div>
                <Link to="/kyc" className="w-full inline-block bg-amber-500 hover:bg-amber-600 text-amber-950 text-center font-extrabold py-3 rounded-xl transition text-sm shadow-sm">
                  Verifikasi Sekarang
                </Link>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-3xl p-6 flex-1 flex flex-col justify-center shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Pendapatan</span>
              </div>
              <p className="text-3xl font-black text-slate-900 mb-1">Rp 0</p>
              <p className="text-xs text-slate-400 font-medium">Akumulasi dari seluruh proyek selesai.</p>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* TRANSACTIONS SECTION (2 COLS) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 h-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">Riwayat Transaksi</h3>
                  <p className="text-xs text-slate-500 mt-1">Mutasi saldo masuk dan keluar.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1 w-full sm:w-auto text-xs font-bold">
                  <button 
                    onClick={() => setFilterTrx('semua')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition ${filterTrx === 'semua' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Semua
                  </button>
                  <button 
                    onClick={() => setFilterTrx('masuk')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition ${filterTrx === 'masuk' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Masuk
                  </button>
                  <button 
                    onClick={() => setFilterTrx('keluar')}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition ${filterTrx === 'keluar' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    Keluar
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-4">
                {filteredRiwayat.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                      <Wallet className="w-8 h-8" />
                    </div>
                    <h4 className="text-slate-900 font-bold mb-1">Belum Ada Transaksi</h4>
                    <p className="text-slate-500 text-sm max-w-xs">Data transaksi Anda akan muncul di sini.</p>
                  </div>
                ) : (
                  filteredRiwayat.map((trx) => {
                    const isMasuk = trx.jenis === 'Masuk';
                    return (
                      <div 
                        key={trx.id} 
                        className="p-4 rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition duration-200 flex items-center justify-between gap-4 group shadow-xs"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isMasuk ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {isMasuk ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate group-hover:text-indigo-600 transition">{trx.judul}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                              <span>{trx.tanggal}</span>
                              <span className="text-slate-300">•</span>
                              <span className="flex items-center text-emerald-600">
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

          {/* RIGHT COLUMN (1 COL) - PROMO */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* ESCROW/REKBER EXPLANATION */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-3xl p-6 shadow-sm">
              <h4 className="font-extrabold text-indigo-950 flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Sistem Rekber
              </h4>
              <p className="text-xs text-indigo-800 leading-relaxed mb-4">
                Saat UMKM menerima lamaran Anda, dana mereka ditahan di sistem <strong>CariCuan</strong>. Setelah karya Anda disetujui, dana otomatis masuk ke saldo Anda tanpa potongan.
              </p>
              <div className="bg-white/60 p-3 rounded-xl border border-white">
                <span className="text-xs font-bold text-slate-500 block mb-1">Total Dana Tertahan Saat Ini:</span>
                <span className="text-lg font-black text-slate-900">Rp 0</span>
              </div>
            </div>

            {/* PROMO / QUICK JOB SEARCH CTA */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-32 relative">
                <img src="/freelance.jpg" alt="Freelance Mahasiswa" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-extrabold text-lg text-slate-900 mb-2">Butuh Cuan Tambahan?</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-5">
                  Ada puluhan proyek UMKM yang siap dikerjakan paruh waktu.
                </p>
                <Link 
                  to="/lowongan" 
                  className="block w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-xl shadow-md transition text-sm"
                >
                  Jelajahi Lowongan
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
                    <span className="text-slate-500">Nominal Penarikan</span>
                    <span className="font-bold text-slate-700">Rp {withdrawAmount || '0'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Biaya Layanan & Pajak (10%)</span>
                    <span className="font-bold text-rose-500">- Rp {withdrawAmount ? (parseInt(withdrawAmount.replace(/\D/g, '')) * 0.10).toLocaleString('id-ID') : '0'}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-200/60">
                    <span className="text-slate-700 font-bold">Total Diterima</span>
                    <span className="font-extrabold text-slate-900">Rp {withdrawAmount ? (parseInt(withdrawAmount.replace(/\D/g, '')) * 0.90).toLocaleString('id-ID') : '0'}</span>
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
                <p className="text-slate-500 text-xs mb-6">Dana sebesar <b>Rp {withdrawAmount ? (parseInt(withdrawAmount.replace(/\D/g, '')) * 0.90).toLocaleString('id-ID') : '0'}</b> (setelah potong pajak) diproses ke rekening Anda.</p>
                
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