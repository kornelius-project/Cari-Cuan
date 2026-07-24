import React, { useState } from 'react';
import { MapPin, Clock, Lock, X, FileText, CheckCircle, Search, Filter, Briefcase, Bookmark, AlertCircle, ChevronDown, LogIn, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CariLowongan() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyingSuccess, setIsApplyingSuccess] = useState(false); // State Lamaran Sukses
  const [isLoggedInState, setIsLoggedInState] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleInlineLogin = (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'mahasiswa');
      if (!localStorage.getItem('userName')) {
        localStorage.setItem('userName', loginEmail ? loginEmail.split('@')[0] : 'Andi (Mahasiswa)');
      }
      setIsLoggedInState(true);
      setIsLoggingIn(false);
      setShowLoginModal(false);
      setIsApplyingSuccess(true);
      window.dispatchEvent(new Event('storage'));
    }, 800);
  };

  const customJobs = JSON.parse(localStorage.getItem('customJobs') || '[]');

  const DEFAULT_JOBS = [
    { 
      id: 1,  
      judul: "Desain Logo & Kemasan Kedai Kopi", 
      harga: "Rp 150.000", 
      durasi: "3 Hari Pengerjaan", 
      umkm: "Kopi Senja", 
      logoPerusahaan: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=150&q=80",
      kategori: "Desain Grafis",
      tipeKerja: "Proyek Lepas",
      lokasi: "Tingkir, Salatiga (Remote)",
      waktuPost: "Diposting 2 jam lalu",
      tags: ["Adobe Illustrator", "CorelDraw", "Desain Kemasan"],
      deskripsi: "Kami membutuhkan desainer kreatif dari kampus untuk merombak logo kedai kopi kami agar terlihat lebih modern, kekinian, dan cocok untuk dicetak di kemasan gelas plastik es kopi susu kami.",
      persyaratan: ["Mahasiswa aktif domisili Salatiga", "Memiliki portofolio desain logo/kemasan", "Bersedia revisi maksimal 2 kali"]
    },
    { 
      id: 2, 
      judul: "Admin Sosial Media Instagram (1 Minggu)", 
      harga: "Rp 300.000", 
      durasi: "7 Hari Pengerjaan", 
      umkm: "Butik Nabila", 
      logoPerusahaan: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=150&q=80",
      kategori: "Digital Marketing",
      tipeKerja: "Part-Time",
      lokasi: "Sidorejo, Salatiga (Remote)",
      waktuPost: "Diposting 5 jam lalu",
      tags: ["Social Media", "Copywriting", "Canva", "Fast Response"],
      deskripsi: "Dicari mahasiswa yang paham algoritma Instagram untuk membalas DM pelanggan dan mengunggah konten (story/feed) secara rutin selama 1 minggu penuh menjelang masa promo diskon mahasiswa.",
      persyaratan: ["Aktif bermedia sosial & paham tren", "Fast respon saat membalas DM (pagi-sore)", "Mampu mengedit foto produk ringan (Canva/Capcut)"]
    },
    { 
      id: 3, 
      judul: "Tenaga Sebar Brosur Area Kampus UKSW", 
      harga: "Rp 100.000", 
      durasi: "1 Hari Pengerjaan", 
      umkm: "Bimbel Juara", 
      logoPerusahaan: "https://images.unsplash.com/photo-1546410531-bea4649288f4?auto=format&fit=crop&w=150&q=80",
      kategori: "Jasa Fisik & Lapangan",
      tipeKerja: "Proyek Lepas",
      lokasi: "Area Kampus UKSW (Di Tempat)",
      waktuPost: "Diposting 1 hari lalu",
      tags: ["Tenaga Fisik", "Komunikasi", "Mahasiswa UKSW"],
      deskripsi: "Tugas lapangan singkat: Kami membutuhkan tenaga mahasiswa untuk menyebarkan 100 lembar brosur bimbingan belajar kami langsung kepada mahasiswa baru yang sedang nongkrong di area fakultas atau kantin.",
      persyaratan: ["Mahasiswa aktif UKSW (memiliki KTM)", "Percaya diri dan ramah saat menyapa", "Bersedia mengirimkan foto bukti penyebaran di grup WhatsApp"]
    },
    { 
      id: 4, 
      judul: "Data Entry Laporan Penjualan Warung Makan", 
      harga: "Rp 200.000", 
      durasi: "2 Hari Pengerjaan", 
      umkm: "Warung Makan Bu Asih", 
      logoPerusahaan: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80",
      kategori: "Administrasi & Data",
      tipeKerja: "Part-Time",
      lokasi: "Argomulyo, Salatiga (Remote)",
      waktuPost: "Diposting 2 hari lalu",
      tags: ["Microsoft Excel", "Google Sheets", "Ketelitian"],
      deskripsi: "Saya butuh bantuan mahasiswa yang teliti untuk memindahkan nota-nota penjualan warung saya selama sebulan terakhir ke dalam format Microsoft Excel agar rapi dan bisa dihitung keuntungannya.",
      persyaratan: ["Mahir menggunakan Excel/Spreadsheet", "Sangat teliti dengan angka", "Punya laptop sendiri"]
    },
    {
      id: 5,
      judul: "Pembuatan Website Profil Usaha",
      harga: "Rp 600.000",
      durasi: "14 Hari Pengerjaan",
      umkm: "Bengkel Motor Pak Yono",
      logoPerusahaan: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=150&q=80",
      kategori: "Teknologi",
      tipeKerja: "Proyek Lepas",
      lokasi: "Tingkir, Salatiga (Remote)",
      waktuPost: "Diposting 3 hari lalu",
      tags: ["Web Development", "Wordpress", "HTML/CSS"],
      deskripsi: "Saya ingin dibuatkan website sederhana yang menampilkan layanan bengkel, daftar harga servis, dan tombol WhatsApp agar pelanggan bisa booking servis secara online.",
      persyaratan: ["Mahasiswa Teknik Informatika", "Paham cara setup hosting/domain gratisan", "Bisa mendesain UI/UX yang simpel dan cepat"]
    },
    {
      id: 6,
      judul: "Kasir Akhir Pekan Toko Buku",
      harga: "Rp 150.000",
      durasi: "2 Hari (Sabtu-Minggu)",
      umkm: "Toko Buku Lentera",
      logoPerusahaan: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=150&q=80",
      kategori: "Jasa Fisik & Lapangan",
      tipeKerja: "Part-Time",
      lokasi: "Kutowinangun, Salatiga (Di Tempat)",
      waktuPost: "Diposting 4 hari lalu",
      tags: ["Kasir", "Ramah", "Jujur"],
      deskripsi: "Dibutuhkan tenaga bantuan untuk berjaga di kasir selama akhir pekan (Sabtu & Minggu). Waktu kerja shift siang dari jam 12:00 sampai 18:00.",
      persyaratan: ["Mahasiswa domisili Salatiga", "Jujur dan teliti menghitung kembalian", "Berpenampilan rapi"]
    },
    {
      id: 7,
      judul: "Penulis Artikel Blog Kopi",
      harga: "Rp 75.000",
      durasi: "2 Hari Pengerjaan",
      umkm: "Roastery Nusantara",
      logoPerusahaan: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=150&q=80",
      kategori: "Digital Marketing",
      tipeKerja: "Proyek Lepas",
      lokasi: "Remote",
      waktuPost: "Diposting 1 minggu lalu",
      tags: ["Copywriting", "SEO", "Artikel"],
      deskripsi: "Kami butuh 3 artikel SEO ramah tentang cara menyeduh kopi manual (V60, French Press) dengan gaya bahasa anak muda (minimal 500 kata per artikel).",
      persyaratan: ["Hobi menulis dan ngopi", "Paham dasar SEO (kata kunci)", "Tidak boleh hasil copy-paste ChatGPT 100%"]
    }
  ];

  const ALL_JOBS = [...customJobs, ...DEFAULT_JOBS];

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    kategori: [],
    tipeKerja: [],
    upah: 'semua'
  });

  const handleCategoryChange = (cat) => {
    setFilters(prev => ({
      ...prev,
      kategori: prev.kategori.includes(cat) 
        ? prev.kategori.filter(c => c !== cat) 
        : [...prev.kategori, cat]
    }));
  };

  const handleTipeChange = (tipe) => {
    setFilters(prev => ({
      ...prev,
      tipeKerja: prev.tipeKerja.includes(tipe) 
        ? prev.tipeKerja.filter(t => t !== tipe) 
        : [...prev.tipeKerja, tipe]
    }));
  };

  const filteredJobs = ALL_JOBS.filter(job => {
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      if (!job.judul.toLowerCase().includes(lowerSearch) && 
          !job.umkm.toLowerCase().includes(lowerSearch) && 
          !job.deskripsi.toLowerCase().includes(lowerSearch) &&
          !job.kategori.toLowerCase().includes(lowerSearch)) {
        return false;
      }
    }
    
    if (filters.kategori.length > 0) {
      if (!filters.kategori.includes(job.kategori)) return false;
    }

    if (filters.tipeKerja.length > 0) {
      if (!filters.tipeKerja.includes(job.tipeKerja)) return false;
    }

    if (filters.upah !== 'semua') {
      const upahNumeric = parseInt(job.harga.replace(/\D/g, ''));
      if (filters.upah === 'bawah100' && upahNumeric >= 100000) return false;
      if (filters.upah === '100to500' && (upahNumeric < 100000 || upahNumeric > 500000)) return false;
      if (filters.upah === 'atas500' && upahNumeric <= 500000) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar />

      {/* HEADER BURSA KERJA */}
      <header className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Cari Lowongan UMKM</h1>
          <p className="text-gray-500">Temukan proyek lepas dari UMKM lokal yang cocok dengan jadwal kuliah Anda.</p>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* SIDEBAR FILTER (RESPONSIVE FOR MOBILE) */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 lg:sticky lg:top-24 shadow-sm">
            <div 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center justify-between gap-2 mb-4 lg:mb-6 border-b border-slate-100 pb-3 lg:pb-4 cursor-pointer lg:cursor-default"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-800 text-sm sm:text-base">Filter Pencarian</h2>
              </div>
              <span className="lg:hidden text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                {isMobileFilterOpen ? 'Sembunyikan' : 'Tampilkan'}
              </span>
            </div>

            <div className={`${isMobileFilterOpen ? 'block' : 'hidden lg:block'} space-y-6`}>
              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Kategori</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.kategori.length === 0} onChange={() => setFilters(prev => ({...prev, kategori: []}))} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Semua Kategori</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.kategori.includes('Desain Grafis')} onChange={() => handleCategoryChange('Desain Grafis')} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Desain Grafis</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.kategori.includes('Digital Marketing')} onChange={() => handleCategoryChange('Digital Marketing')} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Digital Marketing</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.kategori.includes('Jasa Fisik & Lapangan')} onChange={() => handleCategoryChange('Jasa Fisik & Lapangan')} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Jasa Fisik & Lapangan</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.kategori.includes('Administrasi & Data')} onChange={() => handleCategoryChange('Administrasi & Data')} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Administrasi & Data</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.kategori.includes('Teknologi')} onChange={() => handleCategoryChange('Teknologi')} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Teknologi</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Tipe Pekerjaan</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.tipeKerja.includes('Proyek Lepas')} onChange={() => handleTipeChange('Proyek Lepas')} className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" />
                    <span className="text-slate-600 group-hover:text-purple-600 transition text-xs font-medium">Proyek Lepas (Freelance)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={filters.tipeKerja.includes('Part-Time')} onChange={() => handleTipeChange('Part-Time')} className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500" />
                    <span className="text-slate-600 group-hover:text-purple-600 transition text-xs font-medium">Part-Time (Durasi)</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Rentang Upah</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="upah" checked={filters.upah === 'semua'} onChange={() => setFilters(prev => ({...prev, upah: 'semua'}))} className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Semua Harga</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="upah" checked={filters.upah === 'bawah100'} onChange={() => setFilters(prev => ({...prev, upah: 'bawah100'}))} className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Di bawah Rp 100rb</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="upah" checked={filters.upah === '100to500'} onChange={() => setFilters(prev => ({...prev, upah: '100to500'}))} className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Rp 100rb - Rp 500rb</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="upah" checked={filters.upah === 'atas500'} onChange={() => setFilters(prev => ({...prev, upah: 'atas500'}))} className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                    <span className="text-slate-600 group-hover:text-indigo-600 transition text-xs font-medium">Di atas Rp 500rb</span>
                  </label>
                </div>
              </div>

              <button onClick={() => setFilters({ kategori: [], tipeKerja: [], upah: 'semua' })} className="w-full bg-indigo-50 text-indigo-700 font-bold py-2.5 rounded-xl hover:bg-indigo-100 transition text-xs cursor-pointer">
                Reset Filter
              </button>
            </div>
          </div>
        </aside>

        {/* JOB LISTINGS */}
        <section className="flex-1 min-w-0">
          
          {/* Main Search Bar (Responsive) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari lowongan desain, admin, kasir..." 
                className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-slate-800 placeholder-slate-400 text-xs sm:text-sm font-medium"
              />
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md shrink-0 transition">
              Cari Pekerjaan
            </button>
          </div>

          {/* Tips Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start md:items-center gap-4 mb-6">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1 md:mt-0" />
            <p className="text-blue-900 text-sm">
              <strong>Tips Melamar:</strong> UMKM lebih menyukai mahasiswa yang melampirkan portofolio atau tugas kuliah yang relevan dengan pekerjaan yang dilamar. Pastikan profil Anda lengkap!
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-500 text-sm font-medium">Menampilkan <span className="font-bold text-gray-900">{filteredJobs.length}</span> lowongan aktif</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
              Urutkan: <span className="font-bold">Terbaru</span> <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* List Kartu Pekerjaan Profesional */}
          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Pekerjaan tidak ditemukan</h3>
                <p className="text-gray-500">Coba sesuaikan kata kunci atau hapus beberapa filter untuk melihat lebih banyak lowongan.</p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => setSelectedJob(job)}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row gap-5">
                    {/* Logo UMKM (Gambar/Lambang Perusahaan) */}
                    <img 
                      src={job.logoPerusahaan} 
                      alt={job.umkm} 
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-200 shadow-sm"
                    />
  
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">{job.judul}</h3>
                        <button className="text-gray-300 hover:text-blue-600 transition hidden md:block">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-3">
                        <span className={`font-bold px-2 py-0.5 rounded text-xs ${job.tipeKerja === 'Proyek Lepas' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                          {job.tipeKerja}
                        </span>
                        <span className="font-medium text-gray-700 flex items-center"><Briefcase className="w-4 h-4 mr-1 text-gray-400"/> {job.umkm}</span>
                        <span className="hidden md:inline text-gray-300">•</span>
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-gray-400"/> {job.lokasi}</span>
                        <span className="hidden md:inline text-gray-300">•</span>
                        <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-gray-400"/> {job.durasi}</span>
                      </div>
  
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {job.deskripsi}
                      </p>
  
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-md border border-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
  
                    {/* Sisi Kanan (Harga & Waktu) */}
                    <div className="md:w-32 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5">
                      <div className="text-left md:text-right">
                        <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">Upah</p>
                        <p className="text-lg font-black text-green-600">{job.harga}</p>
                      </div>
                      <p className="text-xs text-gray-400 font-medium mt-4 md:mt-0">{job.waktuPost}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      {/* POP-UP DETAIL PEKERJAAN (Tampilan Profesional) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header Pop-up (Bukan gambar cover lagi, tapi solid clean header) */}
            <div className="bg-white border-b border-gray-200 p-6 md:p-8 flex items-start justify-between relative">
              <button 
                onClick={() => setSelectedJob(null)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex gap-5 pr-10">
                  <img 
                    src={selectedJob.logoPerusahaan} 
                    alt={selectedJob.umkm} 
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-200 shadow-sm"
                  />
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">{selectedJob.judul}</h2>
                    <p className="text-blue-600 font-bold">{selectedJob.umkm}</p>
                  </div>
              </div>
            </div>

            {isApplyingSuccess ? (
              <div className="p-12 flex flex-col items-center justify-center text-center flex-1 bg-white">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Lamaran Berhasil Dikirim!</h2>
                <p className="text-gray-500 mb-8 max-w-sm">UMKM {selectedJob.umkm} akan segera meninjau profil dan portofolio Anda. Pantau terus kotak masuk Anda.</p>
                <button 
                  onClick={() => {
                    setIsApplyingSuccess(false);
                    setSelectedJob(null);
                    navigate('/mahasiswa/proyek-aktif');
                  }}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-700 transition"
                >
                  Lihat Status Lamaran
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 md:p-8 overflow-y-auto bg-gray-50 flex-1">
                  {/* Detail Info Bar */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-x-8 gap-y-4 mb-6 shadow-sm relative overflow-hidden">
                    <div className={`absolute right-0 top-0 bottom-0 w-2 ${selectedJob.tipeKerja === 'Proyek Lepas' ? 'bg-orange-400' : 'bg-purple-500'}`}></div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Tipe</p>
                      <div className={`font-bold text-sm ${selectedJob.tipeKerja === 'Proyek Lepas' ? 'text-orange-600' : 'text-purple-600'}`}>
                        {selectedJob.tipeKerja}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Lokasi</p>
                      <div className="flex items-center text-gray-700 font-medium text-sm">
                        <MapPin className="w-4 h-4 mr-1.5 text-blue-500" /> {selectedJob.lokasi}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Durasi</p>
                      <div className="flex items-center text-gray-700 font-medium text-sm">
                        <Clock className="w-4 h-4 mr-1.5 text-blue-500" /> {selectedJob.durasi}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-bold mb-1">Upah</p>
                      <div className="flex items-center text-green-600 font-black text-sm">
                        {selectedJob.harga}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center"><FileText className="w-5 h-5 mr-2 text-gray-400"/> Deskripsi Proyek</h3>
                    <p className="text-gray-600 leading-relaxed bg-white p-5 rounded-xl border border-gray-100 shadow-sm">{selectedJob.deskripsi}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-gray-400"/> Persyaratan Mahasiswa</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600 bg-white p-5 rounded-xl border border-gray-100 shadow-sm ml-1">
                      {selectedJob.persyaratan.map((syarat, idx) => (
                        <li key={idx} className="leading-relaxed pl-2">{syarat}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-gray-500">Keahlian yang Dibutuhkan</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.tags.map((tag, idx) => (
                        <span key={idx} className="bg-white text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action Bar Bottom */}
                <div className="bg-white border-t border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Diiklankan oleh</p>
                    <p className="text-gray-900 font-bold">{selectedJob.umkm}</p>
                  </div>
                  
                  {/* LOGIN TO APPLY LOGIC */}
                  <button 
                    onClick={() => {
                      if (isLoggedInState) {
                        setShowApplyModal(true);
                      } else {
                        setShowLoginModal(true);
                      }
                    }}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center cursor-pointer"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" /> Kirim Lamaran Sekarang
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* POP-UP MODAL LOGIN KETIKA INGIN MELAMAR (JIKA BELUM LOGIN) */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-[60] flex justify-center items-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative">
            
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Masuk ke Akun Anda</h3>
                  <p className="text-xs text-blue-100 font-medium">Login diperlukan untuk mengirimkan lamaran</p>
                </div>
              </div>

              {selectedJob && (
                <div className="mt-3 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs">
                  <span className="text-blue-200">Melamar:</span> <strong className="text-white">{selectedJob.judul}</strong> ({selectedJob.umkm})
                </div>
              )}
            </div>

            {/* Body Form Login */}
            <div className="p-6 md:p-8 space-y-4 bg-white">
              <form onSubmit={handleInlineLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Alamat Email</label>
                  <input 
                    type="email" 
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="mahasiswa@kampus.ac.id" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Kata Sandi</label>
                  <input 
                    type="password" 
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-sm transition font-medium"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm disabled:opacity-70 mt-2 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <span>Memverifikasi...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" /> Masuk & Kirim Lamaran
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2">
                <span>Belum punya akun?</span>
                <div className="space-x-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      navigate('/register');
                    }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Daftar Akun Baru
                  </button>
                  <span className="text-slate-300">•</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      navigate('/login');
                    }}
                    className="text-slate-600 font-semibold hover:underline cursor-pointer"
                  >
                    Halaman Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL LAMAR PEKERJAAN (COVER LETTER) --- */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-900 text-white shrink-0">
              <div>
                <h2 className="text-xl font-extrabold">Form Lamaran Kerja</h2>
                <p className="text-indigo-200 text-xs mt-1">
                  Melamar: <span className="font-bold text-white">{selectedJob?.judul}</span>
                </p>
              </div>
              <button 
                onClick={() => setShowApplyModal(false)} 
                className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex justify-center items-center transition text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                  UMKM akan melihat profil dan keahlian Anda secara otomatis. Gunakan pesan pengantar di bawah ini untuk menonjolkan nilai plus Anda.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pesan Pengantar (Cover Letter)</label>
                <textarea 
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Ceritakan mengapa Anda cocok untuk pekerjaan ini, atau tawarkan negosiasi jika ada..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-medium h-40 resize-none"
                ></textarea>
              </div>

              <button 
                onClick={() => {
                  setShowApplyModal(false);
                  setIsApplyingSuccess(true);
                  setCoverLetter('');
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl transition shadow-lg shadow-indigo-600/20 cursor-pointer flex justify-center items-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" /> Kirim Lamaran Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}
