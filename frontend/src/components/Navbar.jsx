import React, { useState, useEffect } from 'react';
import { 
  Briefcase, User, LogOut, Store, Bell, Search, MessageSquare, 
  HelpCircle, Trophy, Menu, X, ChevronRight, GraduationCap 
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Navbar() {
  const [authStatus, setAuthStatus] = useState(() => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userRole: localStorage.getItem('userRole') || 'mahasiswa'
  }));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [saldoUMKM, setSaldoUMKM] = useState(() => parseInt(localStorage.getItem('saldoUMKM')) || 2500000);
  const [saldoMahasiswa, setSaldoMahasiswa] = useState(() => parseInt(localStorage.getItem('saldoMahasiswa')) || 1250000);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleStorage = () => {
      setAuthStatus({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userRole: localStorage.getItem('userRole') || 'mahasiswa'
      });
      setSaldoUMKM(parseInt(localStorage.getItem('saldoUMKM')) || 2500000);
      setSaldoMahasiswa(parseInt(localStorage.getItem('saldoMahasiswa')) || 1250000);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Close mobile menu on path change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const { isLoggedIn, userRole } = authStatus;

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path ? 'text-indigo-600 font-extrabold' : 'text-slate-600 hover:text-indigo-600 font-semibold';

  return (
    <nav className="bg-white/95 border-b border-slate-200 sticky top-0 z-40 shadow-sm backdrop-blur-md">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 py-3 sm:py-3.5 flex justify-between items-center gap-4">
        
        {/* KIRI: Logo & Desktop Navigation */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link to="/" className="flex items-center hover:opacity-80 transition cursor-pointer shrink-0">
            <img src="/logo.png" alt="Cari Cuan" className="h-14 sm:h-[68px] w-auto object-contain mix-blend-multiply" />
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 text-[15px] font-medium">
            {!isLoggedIn && (
              <>
                <Link to="/lowongan" className="text-slate-600 hover:text-indigo-600 font-semibold transition">Cari Lowongan</Link>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-semibold transition">Dasbor Keuangan</Link>
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-semibold transition">Status Lamaran</Link>
              </>
            )}
            
            {isLoggedIn && userRole === 'mahasiswa' && (
              <>
                <Link to="/lowongan" className={`transition ${isActive('/lowongan')}`}>Cari Lowongan</Link>
                <Link to="/dashboard" className={`transition ${isActive('/dashboard')}`}>Dasbor Keuangan</Link>
                <Link to="/status-lamaran" className={`transition ${isActive('/status-lamaran')}`}>Status Lamaran</Link>
                <Link to="/leaderboard" className={`transition flex items-center gap-1 hover:text-amber-500 ${isActive('/leaderboard')}`}>
                  <Trophy className="w-4 h-4" /> Leaderboard
                </Link>
              </>
            )}

            {isLoggedIn && userRole === 'umkm' && (
              <>
                <Link to="/dashboard-umkm" className={`transition ${isActive('/dashboard-umkm')}`}>Dasbor Bisnis</Link>
                <Link to="/riwayat-transaksi" className={`transition ${isActive('/riwayat-transaksi')}`}>Riwayat Transaksi</Link>
              </>
            )}
          </div>
        </div>

        {/* KANAN: Ikon Actions, Profil, & Mobile Toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              
              {/* BADGE SALDO DOMPET CARICUAN PAY */}
              {userRole === 'umkm' ? (
                <Link 
                  to="/dashboard-umkm" 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-black shadow-md border border-slate-700/80 group"
                  title="Klik untuk Top Up Saldo UMKM"
                >
                  <span className="text-amber-400">💳</span>
                  <span className="tracking-tight">Rp {saldoUMKM.toLocaleString('id-ID')}</span>
                  <span className="bg-indigo-600 group-hover:bg-indigo-500 text-[10px] text-white px-2 py-0.5 rounded-lg font-extrabold ml-1">
                    + Top Up
                  </span>
                </Link>
              ) : (
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-black shadow-md border border-slate-700/80 group"
                  title="Klik untuk Tarik Tunai Saldo"
                >
                  <span className="text-emerald-400">💰</span>
                  <span className="tracking-tight">Rp {saldoMahasiswa.toLocaleString('id-ID')}</span>
                  <span className="bg-emerald-600 group-hover:bg-emerald-500 text-[10px] text-white px-2 py-0.5 rounded-lg font-extrabold ml-1">
                    Tarik
                  </span>
                </Link>
              )}

              {/* Ikon Bantuan */}
              <Link to="/bantuan" className={`p-2 hover:bg-slate-100 rounded-full transition flex ${isActive('/bantuan') ? 'text-indigo-600 bg-slate-100' : 'text-slate-500 hover:text-indigo-600'}`}>
                <HelpCircle className="w-5 h-5" />
              </Link>

              {/* Ikon Pesan */}
              <div className="relative">
                <Link to="/chat" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition relative cursor-pointer block">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">2</span>
                </Link>
              </div>

              {/* Ikon Notifikasi */}
              <div className="relative">
                <button 
                  onClick={() => {setShowNotifications(!showNotifications); setShowHelp(false);}} 
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition relative cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h4 className="font-bold text-slate-900 text-xs">Notifikasi</h4>
                      <span className="text-[10px] text-indigo-600 font-bold cursor-pointer hover:underline">Sudah dibaca</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {userRole === 'umkm' ? (
                        <div className="block p-4 border-b border-slate-50 hover:bg-indigo-50 transition bg-indigo-50/50 cursor-pointer">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 shrink-0"></div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 mb-0.5">Kandidat Baru Melamar!</p>
                              <p className="text-[11px] text-slate-600 leading-relaxed">Andi Saputra telah melamar posisi 'Admin Sosmed'.</p>
                              <p className="text-[9px] text-slate-400 mt-1">10 menit lalu</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Link to="/status-lamaran" className="block p-4 border-b border-slate-50 hover:bg-indigo-50 transition bg-indigo-50/30">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-1.5 shrink-0"></div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 mb-0.5">Lamaran Anda Diterima!</p>
                              <p className="text-[11px] text-slate-600 leading-relaxed">Selamat! Kopi Senja menyetujui lamaran 'Desain Logo'.</p>
                              <p className="text-[9px] text-slate-400 mt-1">10 menit lalu</p>
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Profile Badge */}
              <div className="hidden md:flex items-center gap-2">
                {userRole === 'mahasiswa' ? (
                  <Link to="/profil" className="flex items-center text-slate-700 hover:text-indigo-600 transition font-bold text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-2 rounded-full shadow-sm">
                    <User className="w-3.5 h-3.5 mr-1.5" /> Profil Saya
                  </Link>
                ) : (
                  <Link to="/profil-bisnis" className="flex items-center text-indigo-700 font-bold text-xs bg-indigo-50 border border-indigo-200 px-3.5 py-2 rounded-full shadow-sm cursor-pointer hover:bg-indigo-100 transition">
                    <Store className="w-3.5 h-3.5 mr-1.5" /> Akun Bisnis
                  </Link>
                )}
                
                <button onClick={handleLogout} className="text-rose-500 font-semibold hover:text-rose-600 transition text-xs p-2 rounded-full hover:bg-rose-50 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-4">
              <Link to="/login" className="text-slate-600 font-bold hover:text-indigo-600 transition text-[15px]">Masuk</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition shadow-md text-[15px] shadow-indigo-600/20">
                Daftar
              </Link>
            </div>
          )}

          {/* MOBILE HAMBURGER BUTTON */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition lg:hidden cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU DRAWER (RESPONSIVE DROPDOWN) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-xl">
          
          {/* User Status Bar inside Mobile Drawer */}
          {isLoggedIn && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`p-2 rounded-xl text-white ${userRole === 'mahasiswa' ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                  {userRole === 'mahasiswa' ? <GraduationCap className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-900 text-xs truncate">{localStorage.getItem('userName') || 'Pengguna'}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">{userRole}</p>
                </div>
              </div>
              <Link 
                to={userRole === 'mahasiswa' ? '/profil' : '/profil-bisnis'}
                className="bg-white border border-slate-200 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                Profil
              </Link>
            </div>
          )}

          {/* Nav Links */}
          <div className="space-y-1 font-bold text-sm">
            {!isLoggedIn && (
              <>
                <Link to="/lowongan" className="block px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition">🔍 Cari Lowongan</Link>
                <Link to="/login" className="block px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition">💰 Dasbor Keuangan</Link>
                <Link to="/login" className="block px-3 py-2.5 rounded-xl hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition">📋 Status Lamaran</Link>
              </>
            )}

            {isLoggedIn && userRole === 'mahasiswa' && (
              <>
                <Link to="/lowongan" className={`block px-3 py-2.5 rounded-xl transition ${isActive('/lowongan')}`}>🔍 Cari Lowongan</Link>
                <Link to="/dashboard" className={`block px-3 py-2.5 rounded-xl transition ${isActive('/dashboard')}`}>💰 Dasbor Keuangan</Link>
                <Link to="/status-lamaran" className={`block px-3 py-2.5 rounded-xl transition ${isActive('/status-lamaran')}`}>📋 Status Lamaran</Link>
                <Link to="/leaderboard" className={`block px-3 py-2.5 rounded-xl transition ${isActive('/leaderboard')}`}>🏆 Leaderboard</Link>
                <Link to="/profil" className={`block px-3 py-2.5 rounded-xl transition ${isActive('/profil')}`}>👤 Profil & KYC Saya</Link>
              </>
            )}

            {isLoggedIn && userRole === 'umkm' && (
              <>
                <Link to="/dashboard-umkm" className={`block px-3 py-2.5 rounded-xl transition ${isActive('/dashboard-umkm')}`}>🏬 Dasbor Bisnis UMKM</Link>
                <Link to="/riwayat-transaksi" className={`block px-3 py-2.5 rounded-xl transition ${isActive('/riwayat-transaksi')}`}>💳 Riwayat Transaksi</Link>
                <Link to="/profil-bisnis" className={`block px-3 py-2.5 rounded-xl transition ${isActive('/profil-bisnis')}`}>🏪 Profil Usaha</Link>
              </>
            )}
          </div>

          {/* Auth Actions inside Mobile Drawer */}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isLoggedIn ? (
              <div className="flex gap-2">
                <Link to="/login" className="flex-1 text-center bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-200 transition text-xs">
                  Masuk
                </Link>
                <Link to="/register" className="flex-1 text-center bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition text-xs shadow-md">
                  Daftar Akun
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleLogout} 
                className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Keluar dari Akun
              </button>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}
