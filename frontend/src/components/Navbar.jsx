import React, { useState, useEffect } from 'react';
import { 
  Briefcase, User, LogOut, Store, Bell, Search, MessageSquare, 
  HelpCircle, Trophy, Menu, X, ChevronRight, GraduationCap, Wallet, AlertTriangle
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Navbar() {
  const [authStatus, setAuthStatus] = useState(() => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userRole: localStorage.getItem('userRole') || 'mahasiswa'
  }));

  const [kycStatus, setKycStatus] = useState(() => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr).kycStatus : 'UNVERIFIED';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [saldoUMKM, setSaldoUMKM] = useState(0);
  const [saldoMahasiswa, setSaldoMahasiswa] = useState(0);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });
  const [unreadCount, setUnreadCount] = useState(() => {
    const saved = localStorage.getItem('unreadCount');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('unreadCount', unreadCount.toString());
  }, [notifications, unreadCount]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId && authStatus.isLoggedIn) {
      // Fetch existing missed notifications
      fetch(`http://localhost:5000/api/notifications/${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setNotifications(prev => {
              // Only add ones we don't have (by id)
              const existingIds = new Set(prev.map(n => n.id));
              const newNotifs = data.filter(n => !existingIds.has(n.id));
              if (newNotifs.length > 0) {
                setUnreadCount(c => c + newNotifs.length);
                return [...newNotifs, ...prev].sort((a,b) => b.id - a.id);
              }
              return prev;
            });
          }
        })
        .catch(console.error);

      const socket = io('http://localhost:5000');
      socket.emit('join', userId);
      
      socket.on('receiveNotification', (notif) => {
        setNotifications(prev => [notif, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      return () => socket.disconnect();
    }
  }, [authStatus.isLoggedIn]);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:5000/api/wallet', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (localStorage.getItem('userRole') === 'umkm') {
          setSaldoUMKM(data.balance);
        } else {
          setSaldoMahasiswa(data.balance);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchWallet();
    const handleStorage = () => {
      setAuthStatus({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userRole: localStorage.getItem('userRole') || 'mahasiswa'
      });
      const userStr = localStorage.getItem('user');
      if (userStr) {
        setKycStatus(JSON.parse(userStr).kycStatus);
      } else {
        setKycStatus('UNVERIFIED');
      }
      fetchWallet();
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('kycVerified');
    window.location.href = '/';
  };

  const getAvatar = () => {
    try {
      if (userRole === 'mahasiswa') {
        const p = JSON.parse(localStorage.getItem('mahasiswaProfile'));
        if (p && p.avatar) return p.avatar;
      } else if (userRole === 'umkm') {
        const p = JSON.parse(localStorage.getItem('umkmProfile'));
        if (p && p.fotoProfil) return p.fotoProfil;
      }
    } catch (e) {}
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(localStorage.getItem('userName') || 'User')}&background=c7d2fe&color=3730a3&bold=true`;
  };

  const isActive = (path) => location.pathname === path ? 'text-indigo-600 font-extrabold' : 'text-slate-600 hover:text-indigo-600 font-semibold';

  return (
    <>
      {isLoggedIn && kycStatus !== 'VERIFIED' && (
        <div className="bg-rose-500 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center w-full z-50 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Akun Anda belum terverifikasi KYC. Beberapa fitur dibatasi.</span>
          </div>
          <Link to={userRole === 'mahasiswa' ? '/profil?tab=kyc' : '/profil-bisnis'} className="underline font-bold hover:text-rose-200 ml-1">
            Verifikasi Sekarang
          </Link>
        </div>
      )}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 py-3 flex justify-between items-center gap-4">
        
        {/* KIRI: Logo & Desktop Navigation */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link to="/" className="flex items-center hover:opacity-80 transition cursor-pointer shrink-0">
            <span className="font-bold text-xl tracking-tight text-slate-900">CariCuan.</span>
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-900 hover:bg-slate-100 transition text-sm font-semibold border border-slate-200 group"
                  title="Klik untuk Top Up Saldo UMKM"
                >
                  <Wallet className="w-4 h-4 text-slate-500" />
                  <span className="tracking-tight">Rp {saldoUMKM.toLocaleString('id-ID')}</span>
                </Link>
              ) : (
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-900 hover:bg-slate-100 transition text-sm font-semibold border border-slate-200 group"
                  title="Klik untuk Tarik Tunai Saldo"
                >
                  <Wallet className="w-4 h-4 text-slate-500" />
                  <span className="tracking-tight">Rp {saldoMahasiswa.toLocaleString('id-ID')}</span>
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
                </Link>
              </div>

              {/* Ikon Notifikasi */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowHelp(false);
                    if (!showNotifications) setUnreadCount(0);
                  }} 
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition relative cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"></span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                      <h4 className="font-bold text-slate-900 text-xs">Notifikasi</h4>
                      {notifications.length > 0 && (
                        <span onClick={() => setNotifications([])} className="text-[10px] text-indigo-600 font-bold cursor-pointer hover:underline">Hapus Semua</span>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 px-4 text-center flex flex-col items-center">
                          <Bell className="w-8 h-8 text-slate-200 mb-2" />
                          <p className="text-xs font-bold text-slate-500">Belum Ada Notifikasi</p>
                          <p className="text-[10px] text-slate-400 mt-1">Notifikasi baru akan muncul di sini.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {notifications.map((notif, idx) => (
                            <Link 
                              key={notif.id || idx} 
                              to={notif.link || "#"}
                              onClick={() => setShowNotifications(false)}
                              className="block p-4 hover:bg-slate-50 transition"
                            >
                              <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                  {notif.type === 'success' ? <Trophy className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                                </div>
                                <div>
                                  <h5 className="font-bold text-xs text-slate-900">{notif.title}</h5>
                                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                                  <span className="text-[9px] text-slate-400 font-medium block mt-1">
                                    {new Date(notif.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Desktop Profile Badge */}
              <div className="hidden md:flex items-center gap-2">
                <Link to={userRole === 'mahasiswa' ? "/profil" : "/profil-bisnis"} className="flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition font-semibold text-sm border border-slate-200 p-1 pr-3 rounded-full shadow-sm group">
                  <img src={getAvatar()} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
                  <span>{localStorage.getItem('userName') || 'Pengguna'}</span>
                </Link>
                
                <button onClick={handleLogout} className="text-slate-500 hover:text-rose-600 transition text-sm p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-3">
              <Link to="/login" className="text-slate-600 font-semibold hover:text-slate-900 transition text-sm">Masuk</Link>
              <Link to="/register" className="bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 transition shadow-sm text-sm border border-slate-800">
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
                <div className="shrink-0">
                  <img src={getAvatar()} alt="Profile" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
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
    </>
  );
}
