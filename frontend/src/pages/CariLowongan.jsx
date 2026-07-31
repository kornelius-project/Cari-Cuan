import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Lock, X, FileText, CheckCircle, Search, Filter, Briefcase, Bookmark, AlertCircle, ChevronDown, LogIn, Send, ShieldCheck, MessageSquare } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CariLowongan() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyingSuccess, setIsApplyingSuccess] = useState(false); // State Lamaran Sukses
  const [isLoggedInState, setIsLoggedInState] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const navigate = useNavigate();

  const handleInlineLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, role: 'mahasiswa' })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'mahasiswa');
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedInState(true);
        setKycVerified(data.user.kycStatus === 'VERIFIED');
        setShowLoginModal(false);
        window.dispatchEvent(new Event('storage'));
      } else {
        alert(data.error || 'Login gagal');
      }
    } catch (error) {
      alert('Terjadi kesalahan pada server');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const [ALL_JOBS, setAllJobs] = useState([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setKycVerified(user.kycStatus === 'VERIFIED');
    }
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        const mappedJobs = data.map(job => ({
          id: job.id,
          judul: job.title,
          harga: job.salary || "Rp 0",
          durasi: "Sesuai kesepakatan", 
          umkm: job.umkm?.name || "UMKM",
          umkmId: job.umkm?.id,
          logoPerusahaan: job.imageUrl || "/freelance6.jpg",
          kategori: "Kategori Lain",
          tipeKerja: job.type || "Proyek Lepas",
          lokasi: job.location || "Remote",
          waktuPost: "Baru saja",
          tags: [],
          deskripsi: job.description,
          persyaratan: ["Bersedia menyelesaikan pekerjaan dengan baik"]
        }));
        setAllJobs(mappedJobs);
      })
      .catch(err => console.error(err));
  }, []);

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
    <div className="min-h-screen font-sans bg-slate-50 flex flex-col">
      <Navbar />

      {/* HEADER BURSA KERJA */}
      <header className="bg-white border-b border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Cari Lowongan Pekerjaan</h1>
          <p className="text-slate-500 font-medium">Temukan proyek part-time dan sayembara dari UMKM lokal yang cocok untuk Anda.</p>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTER (RESPONSIVE FOR MOBILE) */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl p-5 lg:sticky lg:top-24 shadow-sm">
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
          <div className="bg-white border border-slate-200 rounded-xl p-2 mb-6 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari lowongan desain, admin, kasir..." 
                className="w-full pl-10 pr-4 py-2.5 bg-transparent outline-none text-slate-900 placeholder-slate-400 text-sm font-medium"
              />
            </div>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-semibold text-sm shadow-sm shrink-0 transition">
              Cari Pekerjaan
            </button>
          </div>

          {/* Tips Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start md:items-center gap-4 mb-6">
            <AlertCircle className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5 md:mt-0" />
            <p className="text-slate-700 text-sm font-medium">
              UMKM lebih menyukai kandidat dengan pesan pengantar yang jelas dan ringkas.
            </p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <p className="text-slate-500 text-sm font-medium">Menampilkan <span className="font-bold text-slate-900">{filteredJobs.length}</span> lowongan aktif</p>
            <div className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer hover:text-slate-900 font-medium">
              Urutkan: <span className="font-semibold text-slate-900">Terbaru</span> <ChevronDown className="w-4 h-4" />
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
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors cursor-pointer group shadow-sm flex flex-col md:flex-row gap-5"
                >
                  <img 
                    src={job.logoPerusahaan} 
                    alt={job.umkm} 
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-100"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-700 transition truncate pr-4">{job.judul}</h3>
                      <button className="text-slate-300 hover:text-slate-900 transition hidden md:block">
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2.5 text-sm text-slate-500 mb-3">
                      <span className={`font-semibold px-2 py-0.5 rounded text-xs ${job.tipeKerja === 'Proyek Lepas' ? 'bg-slate-100 text-slate-700' : 'bg-slate-800 text-slate-100'}`}>
                        {job.tipeKerja}
                      </span>
                      <span className="font-medium text-slate-700 flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400"/> {job.umkm}</span>
                      <span className="hidden md:inline text-slate-300">•</span>
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400"/> {job.lokasi}</span>
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4">
                      {job.deskripsi}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag, idx) => (
                        <span key={idx} className="bg-slate-50 text-slate-600 text-xs font-medium px-2 py-1 rounded border border-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sisi Kanan (Harga & Waktu) */}
                  <div className="md:w-32 flex flex-col justify-between items-start md:items-end pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[11px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Upah</p>
                      <p className="text-base font-bold text-slate-900">{job.harga}</p>
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-4 md:mt-0">{job.waktuPost}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>

      {/* POP-UP DETAIL PEKERJAAN (Tampilan Profesional) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-200">
            
            {/* Header Pop-up */}
            <div className="bg-white border-b border-slate-100 p-6 md:p-8 flex items-start justify-between relative">
              <button 
                onClick={() => setSelectedJob(null)} 
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-2 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex gap-5 pr-10">
                  <img 
                    src={selectedJob.logoPerusahaan} 
                    alt={selectedJob.umkm} 
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 leading-tight mb-1">{selectedJob.judul}</h2>
                    <p className="text-slate-500 font-semibold text-sm">{selectedJob.umkm}</p>
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
                    navigate('/status-lamaran');
                  }}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-700 transition"
                >
                  Lihat Status Lamaran
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 md:p-8 overflow-y-auto bg-white flex-1">
                  {/* Detail Info Bar */}
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex flex-wrap gap-x-8 gap-y-4 mb-6 relative overflow-hidden">
                    <div className={`absolute right-0 top-0 bottom-0 w-1 ${selectedJob.tipeKerja === 'Proyek Lepas' ? 'bg-slate-400' : 'bg-slate-800'}`}></div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Tipe</p>
                      <div className={`font-semibold text-sm ${selectedJob.tipeKerja === 'Proyek Lepas' ? 'text-slate-600' : 'text-slate-900'}`}>
                        {selectedJob.tipeKerja}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Lokasi</p>
                      <div className="flex items-center text-slate-700 font-medium text-sm">
                        <MapPin className="w-4 h-4 mr-1.5 text-slate-400" /> {selectedJob.lokasi}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Durasi</p>
                      <div className="flex items-center text-slate-700 font-medium text-sm">
                        <Clock className="w-4 h-4 mr-1.5 text-slate-400" /> {selectedJob.durasi}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 uppercase font-semibold mb-1">Upah</p>
                      <div className="flex items-center text-slate-900 font-bold text-sm">
                        {selectedJob.harga}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center"><FileText className="w-4 h-4 mr-2 text-slate-400"/> Deskripsi Proyek</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{selectedJob.deskripsi}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-slate-400"/> Persyaratan</h3>
                    <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm ml-1">
                      {selectedJob.persyaratan.map((syarat, idx) => (
                        <li key={idx} className="leading-relaxed pl-2">{syarat}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-3 uppercase tracking-wider">Keahlian Dibutuhkan</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.tags.map((tag, idx) => (
                        <span key={idx} className="bg-white text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Inline Application Form */}
                <div className="bg-slate-50 border-t border-slate-100 p-6 md:p-8">
                  {isLoggedInState ? (
                    !kycVerified ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <ShieldCheck className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Verifikasi Identitas Diperlukan</h3>
                        <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                          Anda harus melengkapi verifikasi identitas (KTP) sebelum dapat melamar pekerjaan di platform ini.
                        </p>
                        <button 
                          onClick={() => navigate('/kyc')}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-2.5 rounded-lg shadow-sm transition inline-flex items-center cursor-pointer"
                        >
                          Lengkapi Verifikasi Sekarang
                        </button>
                      </div>
                    ) : (
                    <>
                      <h3 className="text-base font-bold text-slate-900 mb-5 border-b border-slate-200 pb-3">
                        {selectedJob.tipeKerja === 'Sayembara' ? 'Form Pengumpulan Karya' : 'Form Lamaran Kerja'}
                      </h3>
                      
                      {selectedJob.tipeKerja === 'Sayembara' ? (
                        <>
                          <div className="mb-5 bg-amber-50 p-4 rounded-lg border border-amber-100 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-amber-900 leading-relaxed font-medium">
                              Harap berikan <span className="font-bold text-amber-700">Watermark</span> pada karya Anda sebelum mengunggah. File asli hanya dikirim jika Anda terpilih sebagai pemenang.
                            </p>
                          </div>
                          <div className="mb-5">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Unggah Karya (JPG, PNG, PDF)</label>
                            <input 
                              type="file"
                              accept="image/png, image/jpeg, application/pdf"
                              onChange={(e) => setSubmissionFile(e.target.files[0])}
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-slate-900 transition text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mb-5 bg-indigo-50 p-4 rounded-lg border border-indigo-100 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                              UMKM akan melihat profil Anda secara otomatis. Tulis pesan pengantar di bawah ini.
                            </p>
                          </div>
                          <div className="mb-5">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-2 tracking-wider">Pesan Pengantar (Cover Letter)</label>
                            <textarea 
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              placeholder="Ceritakan mengapa Anda cocok untuk pekerjaan ini..."
                              className="w-full p-3 bg-white border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-600 transition text-sm h-32 resize-none"
                            ></textarea>
                          </div>
                        </>
                      )}

                      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
                        <div className="text-left flex gap-4 items-center">
                          <div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Diiklankan oleh</p>
                            <p className="text-slate-900 font-semibold text-sm">{selectedJob.umkm}</p>
                          </div>
                          {selectedJob.umkmId && (
                            <Link to={`/chat?userId=${selectedJob.umkmId}`} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl transition font-bold text-xs border border-indigo-200 hover:border-indigo-600 shadow-sm" title="Tanya seputar pekerjaan ini">
                              <MessageSquare className="w-4 h-4" />
                              Tanya UMKM
                            </Link>
                          )}
                        </div>
                        <button 
                          onClick={async () => {
                            try {
                              const formData = new FormData();
                              formData.append('jobId', selectedJob.id);
                              formData.append('mahasiswaId', localStorage.getItem('userId'));

                              if (selectedJob.tipeKerja === 'Sayembara') {
                                if (!submissionFile) return alert('File karya wajib diunggah!');
                                formData.append('file', submissionFile);
                              } else {
                                formData.append('coverLetter', coverLetter);
                              }

                              const response = await fetch('http://localhost:5000/api/applications', {
                                method: 'POST',
                                body: formData
                              });
                              const data = await response.json();
                              if (response.ok) {
                                setIsApplyingSuccess(true);
                                setCoverLetter('');
                                setSubmissionFile(null);
                              } else {
                                alert(data.error || 'Gagal mengirim lamaran');
                              }
                            } catch (err) {
                              alert('Terjadi kesalahan');
                            }
                          }}
                          className={`px-6 py-2.5 rounded-lg text-white font-semibold text-sm transition flex items-center justify-center cursor-pointer ${selectedJob.tipeKerja === 'Sayembara' ? 'bg-slate-900 hover:bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        >
                          <Send className="w-4 h-4 mr-2" /> {selectedJob.tipeKerja === 'Sayembara' ? 'Kumpulkan Karya' : 'Kirim Lamaran Sekarang'}
                        </button>
                      </div>
                    </>
                    )
                  ) : (
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Diiklankan oleh</p>
                        <p className="text-slate-900 font-semibold text-sm">{selectedJob.umkm}</p>
                      </div>
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-lg transition flex items-center justify-center cursor-pointer text-sm"
                      >
                        <LogIn className="w-4 h-4 mr-2" /> Login untuk Melamar
                      </button>
                    </div>
                  )}
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


      
      <Footer />
    </div>
  );
}
