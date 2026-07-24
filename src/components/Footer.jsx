import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, GraduationCap, Store, AlertCircle, 
  Check, Lock, ShieldCheck, ChevronRight, Send
} from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState(() => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    userRole: localStorage.getItem('userRole') || 'guest'
  }));

  const [roleAlert, setRoleAlert] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setAuthStatus({
        isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
        userRole: localStorage.getItem('userRole') || 'guest'
      });
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const { isLoggedIn, userRole } = authStatus;

  const handleRoleLinkClick = (e, path, requiredRole, label) => {
    e.preventDefault();

    if (!requiredRole) {
      navigate(path);
      return;
    }

    if (!isLoggedIn) {
      setRoleAlert({
        title: "Login Diperlukan",
        message: `Anda harus masuk ke akun terlebih dahulu untuk mengakses menu "${label}".`,
        type: "guest",
        targetPath: path
      });
      return;
    }

    if (userRole !== requiredRole) {
      setRoleAlert({
        title: "Akses Khusus " + (requiredRole === 'mahasiswa' ? 'Mahasiswa' : 'Mitra UMKM'),
        message: userRole === 'mahasiswa' 
          ? `Akun Anda saat ini terdaftar sebagai Mahasiswa. Menu "${label}" hanya dapat diakses oleh akun Mitra UMKM (Pemberi Kerja).` 
          : `Akun Anda saat ini terdaftar sebagai Mitra UMKM. Menu "${label}" hanya dapat diakses oleh akun Mahasiswa (Pencari Kerja).`,
        type: "restricted",
        currentRole: userRole,
        requiredRole: requiredRole
      });
      return;
    }

    navigate(path);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-8 font-sans border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP STATUS BAR REAKTIF */}
        <div className="mb-12 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Status Sesi Anda:</span>
            {isLoggedIn ? (
              userRole === 'mahasiswa' ? (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Mode Mahasiswa (Pencari Kerja)
                </span>
              ) : (
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-indigo-400" /> Mode Mitra UMKM (Pemberi Kerja)
                </span>
              )
            ) : (
              <span className="bg-slate-800 text-slate-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Tamu (Belum Login)
              </span>
            )}
          </div>

          <div className="text-xs text-slate-400">
            {isLoggedIn ? (
              <span>Terhubung sebagai <strong className="text-white">{localStorage.getItem('userName') || 'Pengguna'}</strong></span>
            ) : (
              <span className="flex items-center gap-2">
                Silakan <Link to="/login" className="text-indigo-400 font-bold hover:underline">Masuk</Link> atau <Link to="/register" className="text-indigo-400 font-bold hover:underline">Daftar</Link> untuk akses penuh
              </span>
            )}
          </div>
        </div>

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 border-b border-slate-800/80 pb-12">
          
          {/* COLUMN 1: BRAND & ABOUT */}
          <div>
            <div className="bg-white inline-block p-2 rounded-2xl mb-5 shadow-md">
              <img src="/logo.png" alt="Cari Cuan Logo" className="h-9 mix-blend-multiply object-contain" />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Cari Cuan adalah platform job connector inovatif yang menghubungkan mahasiswa berbakat dengan UMKM lokal untuk proyek singkat dan paruh waktu secara aman & terpercaya.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition text-xs font-extrabold text-slate-300 hover:text-white">
                FB
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:border-sky-400 transition text-xs font-extrabold text-slate-300 hover:text-white">
                X
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 transition text-xs font-extrabold text-slate-300 hover:text-white">
                IG
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-700 hover:border-indigo-600 transition text-xs font-extrabold text-slate-300 hover:text-white">
                IN
              </a>
            </div>
          </div>

          {/* COLUMN 2: UNTUK MAHASISWA (REAKTIF & ROLE GUARD) */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-extrabold text-white">Untuk Mahasiswa</h4>
            </div>
            <ul className="space-y-3 text-xs">
              <li>
                <a 
                  href="/lowongan" 
                  onClick={(e) => handleRoleLinkClick(e, '/lowongan', null, 'Cari Lowongan')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Cari Lowongan Pekerjaan
                </a>
              </li>
              <li>
                <a 
                  href="/dashboard" 
                  onClick={(e) => handleRoleLinkClick(e, '/dashboard', 'mahasiswa', 'Dasbor Keuangan Mahasiswa')}
                  className={`transition flex items-center gap-1.5 ${isLoggedIn && userRole === 'mahasiswa' ? 'text-emerald-400 font-bold hover:underline' : 'text-slate-400 hover:text-white'}`}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Dasbor Keuangan & Saldo
                </a>
              </li>
              <li>
                <a 
                  href="/status-lamaran" 
                  onClick={(e) => handleRoleLinkClick(e, '/status-lamaran', 'mahasiswa', 'Status Lamaran')}
                  className={`transition flex items-center gap-1.5 ${isLoggedIn && userRole === 'mahasiswa' ? 'text-emerald-400 font-bold hover:underline' : 'text-slate-400 hover:text-white'}`}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Status & Pantau Lamaran
                </a>
              </li>
              <li>
                <a 
                  href="/leaderboard" 
                  onClick={(e) => handleRoleLinkClick(e, '/leaderboard', 'mahasiswa', 'Leaderboard Mahasiswa')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Leaderboard Mahasiswa
                </a>
              </li>
              <li>
                <a 
                  href="/profil" 
                  onClick={(e) => handleRoleLinkClick(e, '/profil', 'mahasiswa', 'Profil & KYC Mahasiswa')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Profil & Verifikasi KYC
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: UNTUK MITRA UMKM (REAKTIF & ROLE GUARD) */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Store className="w-5 h-5 text-indigo-400" />
              <h4 className="text-base font-extrabold text-white">Untuk Mitra UMKM</h4>
            </div>
            <ul className="space-y-3 text-xs">
              <li>
                <a 
                  href="/dashboard-umkm" 
                  onClick={(e) => handleRoleLinkClick(e, '/dashboard-umkm', 'umkm', 'Dasbor Bisnis UMKM')}
                  className={`transition flex items-center gap-1.5 ${isLoggedIn && userRole === 'umkm' ? 'text-indigo-400 font-bold hover:underline' : 'text-slate-400 hover:text-white'}`}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Dasbor Bisnis & Kelola Proyek
                </a>
              </li>
              <li>
                <a 
                  href="/dashboard-umkm" 
                  onClick={(e) => handleRoleLinkClick(e, '/dashboard-umkm', 'umkm', 'Pasang Lowongan Proyek')}
                  className={`transition flex items-center gap-1.5 ${isLoggedIn && userRole === 'umkm' ? 'text-indigo-400 font-bold hover:underline' : 'text-slate-400 hover:text-white'}`}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Pasang Lowongan Proyek Baru
                </a>
              </li>
              <li>
                <a 
                  href="/riwayat-transaksi" 
                  onClick={(e) => handleRoleLinkClick(e, '/riwayat-transaksi', 'umkm', 'Riwayat Transaksi UMKM')}
                  className={`transition flex items-center gap-1.5 ${isLoggedIn && userRole === 'umkm' ? 'text-indigo-400 font-bold hover:underline' : 'text-slate-400 hover:text-white'}`}
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Riwayat Pembayaran & Rekber
                </a>
              </li>
              <li>
                <a 
                  href="/profil-bisnis" 
                  onClick={(e) => handleRoleLinkClick(e, '/profil-bisnis', 'umkm', 'Profil Bisnis UMKM')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Profil Usaha UMKM
                </a>
              </li>
              <li>
                <a 
                  href="/bantuan" 
                  onClick={(e) => handleRoleLinkClick(e, '/bantuan', null, 'Cara Kerja Sistem Escrow')}
                  className="text-slate-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" /> Cara Kerja Garansi Escrow
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: KONTAK & NEWSLETTER */}
          <div>
            <h4 className="text-base font-extrabold text-white mb-5">Pusat Bantuan</h4>
            <ul className="space-y-3 text-xs text-slate-400 mb-6">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Jl. Diponegoro No. 52-60, Salatiga, Jawa Tengah 50711</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>halo@caricuan.id</span>
              </li>
            </ul>
            
            <div>
              <h5 className="font-bold text-xs text-white mb-2 uppercase tracking-wider">Berlangganan Info Lowongan</h5>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email Anda..." 
                  className="bg-slate-900 border border-slate-800 text-white px-3.5 py-2 rounded-xl outline-none w-full text-xs focus:border-indigo-500 transition"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-500 transition font-bold text-xs shrink-0 cursor-pointer">
                  {newsletterSubscribed ? <Check className="w-4 h-4 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
              {newsletterSubscribed && (
                <p className="text-emerald-400 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Berhasil berlangganan newsletter!
                </p>
              )}
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Cari Cuan Inc. Hak cipta dilindungi undang-undang.</p>
          <div className="flex space-x-6">
            <Link to="/bantuan" className="hover:text-slate-300 transition">Syarat & Ketentuan</Link>
            <Link to="/bantuan" className="hover:text-slate-300 transition">Kebijakan Privasi</Link>
            <Link to="/bantuan" className="hover:text-slate-300 transition">Kebijakan Cookie</Link>
          </div>
        </div>

      </div>

      {/* ROLE RESTRICTION ALERT MODAL */}
      {roleAlert && (
        <div className="fixed inset-0 bg-slate-950/70 z-[100] flex justify-center items-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-white relative">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">{roleAlert.title}</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6">
                {roleAlert.message}
              </p>

              <div className="flex gap-3">
                {roleAlert.type === 'guest' ? (
                  <>
                    <button 
                      onClick={() => { setRoleAlert(null); navigate('/login'); }}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
                    >
                      Masuk ke Akun
                    </button>
                    <button 
                      onClick={() => setRoleAlert(null)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
                    >
                      Tutup
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setRoleAlert(null)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition cursor-pointer"
                  >
                    Mengerti & Tutup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
