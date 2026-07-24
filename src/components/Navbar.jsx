import React, { useState, useEffect } from 'react';
import { 
  Briefcase, User, LogOut, Store, Bell, Search, MessageSquare, 
  HelpCircle, Trophy, Menu, X, ChevronRight, GraduationCap 
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [authStatus, setAuthStatus] = useState(() => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userRole: localStorage.getItem('userRole') || 'mahasiswa'
  }));

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Chat States
  const [activeChat, setActiveChat] = useState(null);
  const [replyText, setReplyText] = useState("");
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

  // Dynamic Chat Contacts based on Role
  const chatContacts = userRole === 'umkm' 
    ? [
        { id: 1, name: "Andi Saputra", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80", online: true },
        { id: 2, name: "Siti Aminah", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", online: false }
      ]
    : [
        { id: 1, name: "Kopi Senja", avatar: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=100&q=80", online: true },
        { id: 2, name: "Butik Nabila", avatar: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&q=80", online: false }
      ];

  const [chatHistories, setChatHistories] = useState(
    userRole === 'umkm' ? {
      1: [{ sender: 'other', text: 'Halo, saya melampirkan portofolio saya untuk lowongan Part-Time.', time: '10:30 AM' }],
      2: [{ sender: 'other', text: 'Siang kak, apakah sayembara logo masih buka?', time: 'Kemarin' }]
    } : {
      1: [{ sender: 'other', text: 'Baik, saya tunggu draft logo-nya besok ya!', time: '10:30 AM' }],
      2: [{ sender: 'other', text: 'Apakah Anda bisa mulai hari Senin?', time: 'Kemarin' }]
    }
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !activeChat) return;
    
    setChatHistories(prev => ({
      ...prev,
      [activeChat]: [
        ...prev[activeChat],
        { sender: 'me', text: replyText, time: 'Baru saja' }
      ]
    }));
    setReplyText("");
  };

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
                <button onClick={() => {setShowMessages(!showMessages); setShowNotifications(false); setShowHelp(false); setActiveChat(null);}} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition relative cursor-pointer">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">2</span>
                </button>
                
                {/* Dropdown Pesan */}
                {showMessages && (
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {!activeChat ? (
                      <>
                        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                          <h4 className="font-bold text-slate-900 text-sm">Kotak Masuk</h4>
                          <span className="text-xs text-indigo-600 font-bold cursor-pointer hover:underline">Tandai dibaca</span>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {chatContacts.map(contact => {
                            const msgs = (chatHistories && chatHistories[contact.id]) || [];
                            const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : { sender: 'other', text: 'Pesan baru', time: 'Baru saja' };
                            return (
                              <div 
                                key={contact.id} 
                                onClick={() => setActiveChat(contact.id)}
                                className="p-3.5 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer flex gap-3"
                              >
                                <div className="relative shrink-0">
                                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                                  {contact.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-baseline mb-0.5">
                                    <h5 className="font-bold text-slate-900 text-xs truncate">{contact.name}</h5>
                                    <span className="text-[10px] text-slate-400 shrink-0">{lastMsg.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 truncate font-medium">
                                    {lastMsg.sender === 'me' ? 'Anda: ' : ''}{lastMsg.text}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col h-96">
                        {(() => {
                          const activeContact = chatContacts.find(c => c.id === activeChat);
                          const activeMsgs = (activeChat && chatHistories && chatHistories[activeChat]) || [];
                          return (
                            <>
                              <div className="p-3 border-b border-slate-200 bg-indigo-600 text-white flex items-center gap-3">
                                <button onClick={() => setActiveChat(null)} className="p-1 hover:bg-indigo-700 rounded-full transition cursor-pointer">
                                  <ChevronRight className="w-5 h-5 rotate-180" />
                                </button>
                                <img src={activeContact?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'} className="w-8 h-8 rounded-full object-cover border border-indigo-400" alt="" />
                                <div>
                                  <h4 className="font-bold text-xs leading-tight">{activeContact?.name || 'Kontak'}</h4>
                                  <p className="text-[10px] text-indigo-200">{activeContact?.online ? 'Aktif' : 'Offline'}</p>
                                </div>
                              </div>
                              
                              <div className="flex-1 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3 text-xs">
                                {activeMsgs.map((msg, idx) => (
                                  <div key={idx} className={`flex flex-col max-w-[80%] ${msg.sender === 'me' ? 'self-end items-end' : 'self-start items-start'}`}>
                                    <div className={`p-2.5 rounded-2xl ${msg.sender === 'me' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                                      {msg.text}
                                    </div>
                                    <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                        
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                          <input 
                            type="text" 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Ketik pesan..." 
                            className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                          <button type="submit" disabled={!replyText.trim()} className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer">
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Ikon Notifikasi */}
              <div className="relative">
                <button 
                  onClick={() => {setShowNotifications(!showNotifications); setShowMessages(false); setShowHelp(false);}} 
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
