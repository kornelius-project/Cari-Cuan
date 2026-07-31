import React from 'react';
import { 
  Briefcase, ShieldCheck, Users, CheckCircle, Search, 
  ArrowRight, Sparkles, Store, GraduationCap, DollarSign, Layers, CheckCircle2, Lock, ShieldAlert
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  let heroTitle = (
    <>Solusi Kerja Lepas <br className="hidden sm:inline" />
    <span className="text-indigo-600">Aman & Terpercaya</span> Untuk Semua.</>
  );
  let heroDesc = "Hubungkan talenta mahasiswa berbakat dengan pemilik usaha UMKM lokal. Mahasiswa mendapatkan penghasilan tambahan tanpa mengganggu kuliah, dan UMKM dapat menyelesaikan kebutuhan operasional bisnis secara cepat, efisien, serta terjamin.";

  if (isLoggedIn && userRole === 'umkm') {
    heroTitle = (
      <>Temukan <span className="text-indigo-600">Talenta Mahasiswa</span><br className="hidden sm:inline" /> Terbaik untuk Bisnis Anda.</>
    );
    heroDesc = "Perluas jangkauan operasional bisnis Anda dengan bantuan tenaga freelance mahasiswa. Sistem kerja fleksibel yang menghemat biaya sekaligus memberikan hasil maksimal untuk usaha Anda.";
  } else if (isLoggedIn && userRole === 'mahasiswa') {
    heroTitle = (
      <>Ubah Waktu Luang <br className="hidden sm:inline" /><span className="text-indigo-600">Menjadi Penghasilan</span> Tambahan.</>
    );
    heroDesc = "Ribuan pekerjaan Part-Time dan proyek Sayembara dari UMKM lokal siap dikerjakan. Tambah pengalaman kerja dan penghasilan tanpa mengganggu jadwal kuliah.";
  }

  const handlePostingProyekClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login?role=umkm');
      return;
    }

    if (userRole !== 'umkm') {
      alert("Fitur 'Posting Proyek' khusus untuk Akun Mitra UMKM (Pemberi Kerja). Silakan masuk dengan akun UMKM Anda.");
      navigate('/login?role=umkm');
      return;
    }

    navigate('/dashboard-umkm');
  };

  return (
    <div className="min-h-screen bg-slate-50 animate-landing-fade-in font-sans text-slate-800 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* HERO SECTION MARKETING (SPACIOUS & LUXURIOUS) */}
      <header className="bg-white border-b border-slate-200/80">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Text Column */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-extrabold border border-indigo-200/80 shadow-2xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Platform Kerjasama Mahasiswa & Mitra UMKM #1 di Indonesia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              {heroTitle}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {heroDesc}
            </p>
            
            {/* Dual CTAs (CLEAN SINGLE LINE) */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {(!isLoggedIn || userRole === 'mahasiswa') && (
                <Link 
                  to="/lowongan" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-4 rounded-xl font-extrabold text-sm sm:text-base transition shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer shrink-0"
                >
                  <Search className="w-5 h-5 shrink-0" /> Cari Lowongan Kerja
                </Link>
              )}
              
              {(!isLoggedIn || userRole === 'umkm') && (
                <button 
                  onClick={handlePostingProyekClick} 
                  className="bg-slate-900 hover:bg-slate-800 text-white px-7 py-4 rounded-xl font-extrabold text-sm sm:text-base transition shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 whitespace-nowrap cursor-pointer shrink-0"
                >
                  <Briefcase className="w-5 h-5 text-amber-400 shrink-0" /> {isLoggedIn ? 'Posting Proyek Baru' : 'Posting Proyek UMKM'}
                </button>
              )}
            </div>

            {/* Micro Guarantee Note */}
            <p className="text-slate-400 text-xs sm:text-sm pt-2 flex items-center justify-center lg:justify-start gap-1.5 font-semibold">
              <Lock className="w-4 h-4 text-emerald-600" /> Dilindungi Sistem Rekber Garansi 100% Uang Safe
            </p>

          </div>
          
          {/* Right Visual Image */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
            <div className="bg-slate-100 rounded-3xl p-3.5 border border-slate-200/90 shadow-lg">
              <img 
                src="/freelance2.png" 
                alt="Mahasiswa Bekerja Freelance" 
                className="rounded-2xl shadow-sm object-cover h-[420px] w-full" 
              />
            </div>
            
            {/* Floating Info Badge 1 */}
            <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white p-5 rounded-2xl shadow-xl flex items-center gap-4 border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0 shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">Garansi Rekber</p>
                <p className="font-black text-slate-900 text-base">Pembayaran 100% Safe</p>
              </div>
            </div>
            
            {/* Floating Info Badge 2 */}
            <div className="absolute top-6 -right-4 sm:right-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3.5 border border-slate-200">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shrink-0 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div className="pr-2">
                <p className="font-black text-slate-900 text-sm">500+ Mahasiswa</p>
                <p className="text-xs text-slate-500 font-medium">Siap Kerja Part-Time</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* STATISTIK STRIP (WIDE & CLEAN) */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
            <h3 className="text-4xl font-black text-slate-900 mb-1">500+</h3>
            <p className="text-slate-600 font-extrabold text-sm">Mahasiswa Aktif Terverifikasi KYC</p>
            <p className="text-slate-400 text-xs mt-1">Siap kerja part-time & sayembara</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
            <h3 className="text-4xl font-black text-indigo-600 mb-1">200+</h3>
            <p className="text-slate-600 font-extrabold text-sm">Mitra UMKM Terdaftar</p>
            <p className="text-slate-400 text-xs mt-1">Pemilik usaha lokal terpercaya</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
            <h3 className="text-4xl font-black text-emerald-600 mb-1">100%</h3>
            <p className="text-slate-600 font-extrabold text-sm">Garansi Dana Rekber Aman</p>
            <p className="text-slate-400 text-xs mt-1">Perlindungan hak kedua belah pihak</p>
          </div>
        </div>
      </section>

      {/* SECTION EDUKASI: PANDUAN CARA KERJA DUAL ALUR (STATIC SIDE-BY-SIDE) */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-700 text-xs font-black uppercase tracking-wider bg-indigo-50 px-4 py-1.5 rounded-md border border-indigo-200">
              Panduan Transparan
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 mb-3 tracking-tight">
              Bagaimana CariCuan Bekerja?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
              Panduan lengkap alur kerja untuk Mahasiswa dan Mitra UMKM secara langsung tanpa harus bingung berpindah halaman.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* ALUR UNTUK MAHASISWA */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-indigo-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xl border border-indigo-100 shadow-sm">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Alur Untuk Mahasiswa</h3>
                    <p className="text-xs text-slate-500 font-medium">Bagi Pencari Lowongan Pekerjaan</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-indigo-600 text-white font-black text-sm rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base mb-1">Cari & Pilih Lowongan Proyek</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        Pilih pekerjaan Part-Time (kasir toko, admin sosmed) atau Sayembara Desain yang waktunya cocok dengan jam kuliah Anda.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-indigo-600 text-white font-black text-sm rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base mb-1">Kerjakan Tugas & Upload Hasil</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        Kerjakan tugas pekerjaan sesuai instruksi atau upload draft karya sayembara terbaik Anda secara langsung di dasbor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-emerald-600 text-white font-black text-sm rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base mb-1">Terima Upah di Dompet Cuan</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        Begitu karya disetujui UMKM, upah otomatis masuk ke Dompet Mahasiswa dan dapat ditarik langsung ke Bank atau E-Wallet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link to="/lowongan" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex justify-center items-center gap-2 cursor-pointer">
                  <Search className="w-4 h-4" /> Mulai Cari Lowongan Mahasiswa
                </Link>
              </div>
            </div>

            {/* ALUR UNTUK MITRA UMKM */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-amber-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl border border-amber-100 shadow-sm">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Alur Untuk Mitra UMKM</h3>
                    <p className="text-xs text-slate-500 font-medium">Bagi Pemilik Usaha / Pemberi Kerja</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-amber-500 text-white font-black text-sm rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base mb-1">Top Up & Posting Lowongan</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        Isi Saldo Bisnis dan pasang lowongan Part-Time atau Sayembara sesuai kriteria, deadline, dan anggaran usaha Anda.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-amber-500 text-white font-black text-sm rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base mb-1">Anggaran Aman di Rekber Safe</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        Saldo diproteksi oleh sistem Rekber CariCuan. Uang Anda aman dan tidak terpotong sebelum Anda puas dengan hasil kerja.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 bg-emerald-600 text-white font-black text-sm rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base mb-1">Setujui Hasil & Cairkan Pembayaran</h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                        Evaluasi hasil pekerjaan mahasiswa. Klik "Setujui Karya" untuk mencairkan pembayaran langsung ke mahasiswa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button onClick={handlePostingProyekClick} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex justify-center items-center gap-2 cursor-pointer">
                  <Briefcase className="w-4 h-4" /> Posting Lowongan Usaha Baru
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION EDUKASI REKBER ESCROW (KENAPA DANA 100% AMAN?) */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-4 py-1.5 rounded-md uppercase tracking-wider">
              Sistem Keamanan Rekber
            </span>
            <h2 className="text-3xl sm:text-4xl font-black mt-4 mb-3 tracking-tight">
              Kenapa Sistem Rekber CariCuan 100% Aman?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium leading-relaxed">
              Kami bertindak sebagai pihak ketiga tepercaya untuk memastikan transaksi adil tanpa risiko penipuan bagi UMKM maupun Mahasiswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-5 border border-indigo-500/30 font-black text-lg">
                  1
                </div>
                <h4 className="font-extrabold text-white text-lg mb-2">UMKM Memasang Anggaran</h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                  Saat UMKM membuat lowongan, dana dialokasikan ke Rekber CariCuan. UMKM mendapat kepastian bahwa anggaran aman & terukur.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-5 border border-amber-500/30 font-black text-lg">
                  2
                </div>
                <h4 className="font-extrabold text-white text-lg mb-2">Mahasiswa Bekerja Tenang</h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                  Mahasiswa tidak perlu khawatir tidak dibayar setelah bekerja, karena dana garansi proyek sudah terkunci di sistem Rekber.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-5 border border-emerald-500/30 font-black text-lg">
                  3
                </div>
                <h4 className="font-extrabold text-white text-lg mb-2">Pencairan Otomatis Adil</h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                  Begitu UMKM menyetujui hasil karya yang dikirim, sistem secara otomatis mentransfer dana dari Rekber langsung ke Dompet Mahasiswa.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION KATEGORI PEKERJAAN POPULER & DETAIL INFORMATIF (SANGAT INFORMATIF & JELAS) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Kategori Pekerjaan Populer</h2>
            <p className="text-slate-600 text-sm font-medium">Detail jenis lowongan, estimasi honor, dan keahlian yang banyak dicari UMKM</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            
            {/* Kategori 1: Kreatif & Visual Desain */}
            <Link to="/lowongan" className="group bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-14 h-14 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300 shadow-sm">
                <Layers className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xl mb-1.5 group-hover:text-indigo-600 transition-colors">Kreatif & Visual Desain</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Bantu UMKM tampil profesional dengan karya desainmu. Cocok untuk kreator logo, banner promosi, hingga kemasan produk tanpa terikat software tertentu.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">Bebas Alat</span>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">Kerja Remote</span>
                </div>
              </div>
            </Link>

            {/* Kategori 2: Pemasaran & Sosmed */}
            <Link to="/lowongan" className="group bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 hover:border-emerald-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-emerald-600 group-hover:border-emerald-600 transition-all duration-300 shadow-sm">
                <Sparkles className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xl mb-1.5 group-hover:text-emerald-600 transition-colors">Pemasaran & Sosmed</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Punya ide konten menarik? Bantu kelola media sosial UMKM, buat video pendek kreatif, dan berinteraksi aktif membangun audiens mereka.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">Kreatif</span>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">Waktu Fleksibel</span>
                </div>
              </div>
            </Link>

            {/* Kategori 3: Operasional & Pelayanan */}
            <Link to="/lowongan" className="group bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 hover:border-amber-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300 shadow-sm">
                <Store className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xl mb-1.5 group-hover:text-amber-600 transition-colors">Operasional & Pelayanan</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Terjun langsung membantu roda usaha UMKM lokal. Tersedia lowongan sebagai asisten toko, kasir part-time, hingga penjaga booth event pameran.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">On-Site / Lokal</span>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">Pelayanan Aktif</span>
                </div>
              </div>
            </Link>

            {/* Kategori 4: Administrasi & Data */}
            <Link to="/lowongan" className="group bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 shadow-sm">
                <Briefcase className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-xl mb-1.5 group-hover:text-blue-600 transition-colors">Administrasi & Data</h4>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">
                  Dibutuhkan ketelitian tinggi! Bantu UMKM merapikan rekap transaksi harian, pembukuan sederhana, hingga memantau manajemen stok barang.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">Ketelitian Data</span>
                  <span className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-extrabold uppercase tracking-wider rounded-lg border border-slate-200">Kerja Remote</span>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* CALL TO ACTION BOTTOM BANNER */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 text-center">
          <div className="bg-gradient-to-r from-indigo-900/60 via-slate-800 to-indigo-900/60 p-10 sm:p-14 rounded-3xl border border-indigo-500/30">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 tracking-tight">
              Siap Merekrut Talenta Atau Hasilkan Cuan?
            </h2>
            <p className="text-slate-300 text-base mb-8 max-w-xl mx-auto font-medium leading-relaxed">
              Bergabung dengan ratusan UMKM dan mahasiswa lainnya dalam ekosistem kerja lepas lokal yang terjamin aman.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/lowongan" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm px-8 py-4 rounded-xl shadow-md transition whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4 shrink-0" /> Cari Lowongan Kerja
              </Link>
              <button 
                onClick={handlePostingProyekClick}
                className="bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-sm px-8 py-4 rounded-xl shadow-md transition cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-indigo-600 shrink-0" /> Posting Proyek UMKM
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}