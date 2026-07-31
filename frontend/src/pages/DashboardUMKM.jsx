import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Activity, ShieldCheck, CheckCircle, 
  Plus, Users, Layers, Check, X, Download, Star, MapPin, AlertCircle, Sparkles, Filter, Store,
  Wallet, CreditCard, QrCode, ArrowUpRight, RefreshCw, Settings, Trash2, Image as ImageIcon, LinkIcon, FileText
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DashboardUMKM() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole') || 'guest';
  const rawUserName = localStorage.getItem('userName');
  const storeName = (isLoggedIn && userRole === 'umkm' && rawUserName) ? rawUserName : 'Mitra UMKM';
  const [kycVerified, setKycVerified] = useState(false);

  // --- STATE DOMPET DIGITAL (SALDO UMKM) ---
  const [saldoBisnis, setSaldoBisnis] = useState(0);
  const [riwayatTransaksi, setRiwayatTransaksi] = useState([]);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('http://localhost:5000/api/wallet', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSaldoBisnis(data.balance);
        setRiwayatTransaksi(data.transactions);
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
    window.addEventListener('storage', fetchWallet);
    return () => window.removeEventListener('storage', fetchWallet);
  }, []);

  // --- STATE DATA ---
  const [daftarProyekUMKM, setProyekAktif] = useState([]);

  useEffect(() => {
    if (isLoggedIn && userRole === 'umkm') {
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetch(`http://localhost:5000/api/jobs/umkm/${userId}`)
          .then(res => res.json())
          .then(data => {
            const mappedJobs = data.map(job => ({
              id: job.id,
              judul: job.title,
              tipeKerja: job.type || "Part-Time",
              waktu: new Date(job.createdAt).toLocaleDateString('id-ID'),
              status: job.status === 'open' ? 'Mencari Kandidat' : 'Selesai',
              budget: parseInt(job.salary?.replace(/\D/g, '')) || 0,
              isApproved: job.status === 'closed',
              kandidatCount: job.applications?.length || 0,
              applications: job.applications || [],
              deskripsi: job.description,
              gambar: job.imageUrl
            }));
            setProyekAktif(mappedJobs);
          })
          .catch(err => console.error(err));
      }
    }
  }, [isLoggedIn, userRole]);

  // Form Posting
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({ judul: '', tipeKerja: 'Part-Time', budget: '', deskripsi: '', persyaratan: '', gambar: '' });

  // --- HELPER FUNCTIONS ---
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };



  const handlePostingSubmit = async (e) => {
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
    const POSTING_FEE = 25000;
    if (cost + POSTING_FEE > saldoBisnis) {
      setFormError(`Saldo UMKM tidak mencukupi! Total biaya: Rp ${(cost + POSTING_FEE).toLocaleString('id-ID')} (Anggaran Rp ${cost.toLocaleString('id-ID')} + Biaya Publikasi Rp 25.000). Saldo Anda: Rp ${saldoBisnis.toLocaleString('id-ID')}. Silakan Top Up terlebih dahulu.`);
      return;
    }
    setFormError('');

    try {
      const userId = parseInt(localStorage.getItem('userId'));
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.judul,
          description: formData.deskripsi + (formData.persyaratan ? `\n\nPersyaratan Khusus:\n${formData.persyaratan}` : ''),
          salary: `Rp ${cost.toLocaleString('id-ID')}`,
          location: 'Remote',
          type: formData.tipeKerja.includes('Sayembara') ? 'Sayembara' : 'Part-Time',
          umkmId: userId,
          imageUrl: formData.gambar
        })
      });

      if (response.ok) {
        const newJob = await response.json();
        // Fetch wallet to update balances immediately
        await fetchWallet();

        setProyekAktif([{
          id: newJob.id,
          judul: newJob.title,
          tipeKerja: newJob.type,
          waktu: new Date(newJob.createdAt).toLocaleDateString('id-ID'),
          status: newJob.status === 'open' ? 'Mencari Kandidat' : 'Selesai',
          budget: cost,
          isApproved: false,
          kandidatCount: 0,
          applications: [],
          gambar: formData.gambar
        }, ...daftarProyekUMKM]);

        showToast(`Pekerjaan diposting! Anggaran Rp ${cost.toLocaleString('id-ID')} dialokasikan ke Escrow & Biaya Publikasi Rp 25.000 dipotong.`);
        setFormData({ judul: '', tipeKerja: 'Part-Time', budget: '', deskripsi: '', persyaratan: '', gambar: '' });
        setShowPostingForm(false);
      } else {
        const errData = await response.json();
        showToast(errData.error || "Gagal memposting pekerjaan.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan koneksi.", "error");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.judul.trim()) {
      showToast("Judul Pekerjaan tidak boleh kosong!", "error");
      return;
    }
    const cost = parseInt(editFormData.budget.toString().replace(/\D/g, '')) || 0;
    if (cost <= 0) {
      showToast("Masukkan anggaran pekerjaan yang valid!", "error");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${editingProject}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFormData.judul,
          description: editFormData.deskripsi,
          salary: `Rp ${cost.toLocaleString('id-ID')}`,
          location: 'Remote',
          type: editFormData.tipeKerja.includes('Sayembara') ? 'Sayembara' : 'Part-Time'
        })
      });

      if (response.ok) {
        const updatedJob = await response.json();
        setProyekAktif(daftarProyekUMKM.map(p => 
          p.id === editingProject ? {
            ...p,
            judul: updatedJob.title,
            tipeKerja: updatedJob.type,
            budget: cost,
            deskripsi: updatedJob.description
          } : p
        ));
        showToast("Perubahan berhasil disimpan!");
        setEditingProject(null);
      } else {
        showToast("Gagal menyimpan perubahan.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan koneksi.", "error");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProyekAktif(daftarProyekUMKM.filter(p => p.id !== id));
        showToast("Proyek berhasil dihapus.");
        setEditingProject(null);
      } else {
        showToast("Gagal menghapus proyek.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan koneksi.", "error");
    }
  };

  const handleTerimaKandidat = async (appId, projectId, pelamarName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/applications/${appId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 0 }) // For Part-Time, amount is 0 immediately, paid manually later
      });
      
      if (response.ok) {
        setSelectedPortfolio(null);
        setSelectedApplicantsId(null);
        fetchWallet();
        
        // Update local state so UI reflects it immediately
        setProyekAktif(prev => prev.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              status: 'Sedang Dikerjakan',
              isApproved: true,
              applications: p.applications.map(a => 
                a.id === appId ? { ...a, status: 'APPROVED' } : { ...a, status: 'REJECTED' }
              )
            };
          }
          return p;
        }));
        
        showToast(`Berhasil merekrut ${pelamarName}!`);
      } else {
        const data = await response.json();
        showToast(data.error || "Gagal merekrut kandidat", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan server saat merekrut", "error");
    }
  };

  const handleDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const filename = url.split('/').pop() || 'karya-mahasiswa';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      showToast("Gagal mengunduh file", "error");
    }
  };

  const handleApproveApplication = async (appId, mahasiswaId, projectId, amount, jobTitle, jobType) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/applications/${appId}/approve`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ amount })
        });
        
        if (response.ok) {
          fetchWallet();
          // Update local state so UI reflects it immediately
          setProyekAktif(prev => prev.map(p => {
          if (p.id === projectId) {
            return {
              ...p,
              status: 'Selesai',
              isApproved: true,
              applications: p.applications.map(a => 
                a.id === appId ? { ...a, status: 'APPROVED' } : { ...a, status: 'REJECTED' }
              )
            };
          }
          return p;
        }));
        showToast(`Karya Disetujui! Rp ${amount.toLocaleString('id-ID')} dicairkan ke Dompet Mahasiswa.`);
      } else {
        showToast("Gagal menyetujui karya", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan server", "error");
    }
  };

  // --- CALCULATIONS ---
  const totalDanaEscrow = (daftarProyekUMKM || []).reduce((acc, p) => p?.isApproved ? acc : acc + (p?.budget || 0), 0);
  const activeProjects = (daftarProyekUMKM || []).filter(p => !p?.isApproved).length;
  const totalKandidat = (daftarProyekUMKM || []).reduce((acc, p) => p?.isApproved ? acc : acc + (p?.kandidatCount || 0), 0);

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
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({ judul: '', tipeKerja: '', budget: '', deskripsi: '' });

  // --- DYNAMIC APPLICANTS DATA ---
  let currentApplicants = [];
  if (selectedApplicantsId) {
    const proj = daftarProyekUMKM.find(p => p.id === selectedApplicantsId);
    if (proj && proj.applications) {
      currentApplicants = proj.applications.map((app) => {
        let avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(app.mahasiswa?.name || "Mahasiswa")}&background=c7d2fe&color=3730a3&bold=true`;
        let jurusanStr = "Sistem Informasi";
        let skillsArr = ["Desain Grafis", "Copywriting"];
        
        try {
          const mProfile = JSON.parse(localStorage.getItem('mahasiswaProfile'));
          if (mProfile && mProfile.nama === app.mahasiswa?.name) {
            if (mProfile.avatar) avatarUrl = mProfile.avatar;
            if (mProfile.jurusan) jurusanStr = mProfile.jurusan;
          }
          const mSkills = JSON.parse(localStorage.getItem('mahasiswaSkills'));
          if (mSkills && mSkills.length > 0) skillsArr = mSkills;
        } catch(e) {}

        return {
          id: app.mahasiswa?.id || app.mahasiswaId,
          appId: app.id,
          projectId: proj.id,
          nama: app.mahasiswa?.name || "Mahasiswa",
          univ: "Universitas Negeri",
          jurusan: jurusanStr,
          rating: 4.8, 
          jobsDone: Math.floor(Math.random() * 5) + 1, 
          avatar: avatarUrl,
          skills: skillsArr,
          pesanLamaran: app.coverLetter || "Tidak ada pesan pengantar (atau ini lamaran jalur sayembara).",
          portfolioImages: app.submissionUrl ? [app.submissionUrl] : []
        };
      });
    }
  }

  const filteredProyek = (daftarProyekUMKM || []).filter(p => {
    if (filterTipe === 'part-time') return p?.tipeKerja === 'Part-Time';
    if (filterTipe === 'sayembara') return p?.tipeKerja === 'Sayembara';
    return true;
  });

  const handleTopUpSubmit = async (e) => {
    e.preventDefault();
    const amount = parseInt(topUpAmount.replace(/\D/g, ''));
    if (!amount || amount < 10000) {
      alert("Minimal top up adalah Rp 10.000");
      return;
    }
    
    setIsProcessingTopUp(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/wallet/topup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });
      if (response.ok) {
        await fetchWallet();
        setShowTopUpModal(false);
        setTopUpAmount('100000');
        showToast(`Berhasil Top Up sebesar Rp ${amount.toLocaleString('id-ID')}`);
      } else {
        const data = await response.json();
        showToast(data.error || 'Top up gagal', 'error');
      }
    } catch (err) {
      showToast('Terjadi kesalahan koneksi', 'error');
    }
    setIsProcessingTopUp(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* TOAST */}
      {toast && (
        <div className="fixed top-24 right-6 z-[9999] animate-in slide-in-from-right-8 fade-in duration-300">
          <div className={`${toast.type === 'error' ? 'bg-rose-600 border-rose-700' : 'bg-slate-900 border-slate-800'} text-white shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[300px] border`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-6 h-6 text-rose-200 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            )}
            <div>
              <p className="font-semibold text-sm">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="ml-auto text-slate-300 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 sm:px-10 lg:px-12 py-10">
        
        {/* BANNER PENJELASAN (JIKA BELUM LOGIN SEBAGAI UMKM) */}
        {(!isLoggedIn || userRole !== 'umkm') && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-200 text-slate-700 rounded-lg shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-0.5">Area Ini Adalah Dasbor Mitra UMKM</h4>
                <p className="text-slate-600 text-xs leading-relaxed max-w-2xl">
                  Fitur <strong>"Posting Proyek"</strong> digunakan oleh pemilik usaha (UMKM) untuk memasang lowongan pekerjaan.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link to="/lowongan" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition shadow-sm flex items-center gap-1.5 border border-slate-800">
                <Search className="w-4 h-4" /> Cari Lowongan
              </Link>
            </div>
          </div>
        )}

        {/* HERO HEADER CARD FOR UMKM (CLEAN HUMAN SAAS) */}
        <header className="mb-8 bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  Mitra UMKM
                </span>
                {kycVerified && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Terverifikasi
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{storeName}</h1>
            </div>
          </div>

          {kycVerified ? (
            <button 
              onClick={() => setShowPostingForm(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm cursor-pointer border border-slate-800 shrink-0"
            >
              <Plus className="w-4 h-4" /> Posting Proyek Baru
            </button>
          ) : (
            <Link 
              to="/kyc"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm cursor-pointer border border-amber-600 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" /> Verifikasi KYC untuk Posting
            </Link>
          )}
        </header>

        {/* METRIK STATISTIK & E-WALLET UMKM CARDS (CLEAN HUMAN DESIGN) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          {/* CARD DOMPET BISNIS UMKM (TOP UP) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border border-slate-200">
                  CariCuan Pay
                </span>
              </div>
              <h3 className="text-slate-400 font-bold text-[11px] uppercase tracking-wider mb-1">Saldo Bisnis (Tersedia)</h3>
              <p className="text-2xl font-black text-slate-900 tracking-tight">Rp {saldoBisnis.toLocaleString('id-ID')}</p>
            </div>

            <button 
              onClick={() => setShowTopUpModal(true)}
              className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
            >
              <Plus className="w-4 h-4 text-slate-500" /> Top Up Saldo UMKM
            </button>
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
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-5 text-slate-300">
                  <Briefcase className="w-10 h-10" />
                </div>
                <h4 className="text-slate-900 font-extrabold text-lg mb-2">Belum Ada Proyek</h4>
                <p className="text-slate-500 text-sm max-w-sm mb-6">Anda belum memposting proyek apapun. Buat lowongan pertama Anda untuk mulai mencari talenta mahasiswa terbaik!</p>
                {kycVerified ? (
                  <button onClick={() => setShowPostingForm(true)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm">
                    Buat Lowongan
                  </button>
                ) : (
                  <Link to="/kyc" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl transition text-sm">
                    Verifikasi KYC Dulu
                  </Link>
                )}
              </div>
            ) : (
              filteredProyek.map(proyek => {
                const isSayembara = proyek.tipeKerja === 'Sayembara';
                
                return (
                  <div key={proyek.id} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-5 rounded-2xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 hover:border-slate-300 transition duration-300 gap-4">
                    
                    {/* Left Info */}
                    <div className="flex gap-4 items-center min-w-0">
                      {proyek.gambar ? (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-200">
                          <img src={proyek.gambar} alt="Proyek" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${isSayembara ? 'bg-pink-100 text-pink-600' : 'bg-indigo-100 text-indigo-600'}`}>
                          {isSayembara ? <Layers className="w-7 h-7" /> : <Activity className="w-7 h-7" />}
                        </div>
                      )}
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
                      <div className="flex items-center gap-2">
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
                        <button 
                          onClick={() => {
                            setEditingProject(proyek.id);
                            setEditFormData({
                              judul: proyek.judul,
                              tipeKerja: proyek.tipeKerja,
                              budget: proyek.budget,
                              deskripsi: proyek.deskripsi || '' // Note: we need deskripsi from API
                            });
                          }}
                          className="p-3 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-indigo-600 rounded-2xl transition cursor-pointer"
                          title="Detail & Edit Proyek"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
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
                  <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">Daftar Pelamar ({currentApplicants.length})</h3>
                  <span className="text-[11px] text-indigo-600 font-bold">Pilih untuk detail</span>
                </div>

                {currentApplicants.map((pelamar) => {
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
                  const candidate = currentApplicants.find(a => a.id === activeApplicantId) || currentApplicants[0];
                  if (!candidate) {
                    return (
                      <div className="flex-1 flex justify-center items-center h-full text-slate-400 text-sm font-medium">
                        Belum ada pelamar untuk proyek ini.
                      </div>
                    );
                  }
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
                            navigate(`/chat?userId=${candidate.id}`);
                          }}
                          className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-2xl transition text-xs flex justify-center items-center gap-2 cursor-pointer"
                        >
                          💬 Chat / Interview Mahasiswa
                        </button>

                        <button 
                          onClick={() => handleTerimaKandidat(candidate.appId, candidate.projectId, candidate.nama)}
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
      {selectedReviewId && (() => {
        const p = daftarProyekUMKM.find(p => p.id === selectedReviewId);
        const submissions = p?.applications || [];
        
        return (
          <div className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in zoom-in-95 duration-200">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
              
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Peninjauan Karya Sayembara</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">Proyek: <span className="font-bold">{p?.judul}</span></p>
                </div>
                <button onClick={() => setSelectedReviewId(null)} className="w-9 h-9 bg-white border border-slate-200 hover:bg-slate-100 rounded-full flex justify-center items-center transition cursor-pointer">
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="p-6 sm:p-8 bg-slate-100 flex-1 overflow-y-auto">
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-medium">Belum ada mahasiswa yang mengirimkan karya.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {submissions.map((app, idx) => (
                      <div key={app.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="block text-sm font-bold text-slate-800">{app.mahasiswa?.name || 'Mahasiswa Anonim'}</span>
                            <span className="block text-xs text-slate-500">{app.mahasiswa?.email}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1 bg-slate-50 rounded-xl flex items-center justify-center p-4 border border-slate-100 relative overflow-hidden mb-4 min-h-[200px]">
                          {app.submissionUrl ? (
                            <>
                              <img 
                                src={app.submissionUrl} 
                                alt="Karya Mahasiswa" 
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                              {/* Fallback if image fails to load (e.g. it's a Drive link) */}
                              <div className="hidden flex-col items-center justify-center text-center p-4 h-full w-full bg-slate-100">
                                <LinkIcon className="w-8 h-8 text-slate-400 mb-2" />
                                <p className="text-sm font-bold text-slate-600">Karya Berupa Tautan Eksternal</p>
                                <p className="text-xs text-slate-500 mt-1">Setujui karya ini untuk membuka tautan seutuhnya.</p>
                              </div>

                              {!p?.isApproved && (
                                <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center overflow-hidden">
                                  {/* Pattern Watermark for better visibility */}
                                  <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHRleHQgeD0iMCIgeT0iMjAiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiMwMDAiIHRyYW5zZm9ybT0icm90YXRlKC00NSAwIDIwKSI+V0FURVJNQVJSPC90ZXh0Pjwvc3ZnPg==')] pointer-events-none"></div>
                                  
                                  <div className="bg-slate-900/40 backdrop-blur-sm px-6 py-3 rounded-2xl flex flex-col items-center shadow-2xl border border-white/20 transform -rotate-12">
                                    <ShieldCheck className="w-8 h-8 text-white/90 mb-1" />
                                    <span className="font-black text-white/90 tracking-[0.3em] text-sm">PREVIEW</span>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="text-slate-400 text-xs">Link/Gambar tidak valid</span>
                          )}
                        </div>

                        {!p?.isApproved ? (
                          <button 
                            onClick={() => {
                              if (window.confirm(`Setujui karya dari ${app.mahasiswa?.name} dan cairkan dana?`)) {
                                handleApproveApplication(app.id, app.mahasiswa.id, p.id, p.budget, p.judul, p.tipeKerja);
                              }
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl transition flex justify-center items-center text-sm shadow-md cursor-pointer"
                          >
                            <Check className="w-4 h-4 mr-2" /> Setujui Karya Ini
                          </button>
                        ) : app.status === 'APPROVED' ? (
                          <button 
                            onClick={() => handleDownload(app.submissionUrl)}
                            className="w-full bg-slate-900 hover:bg-slate-950 text-white font-extrabold py-3 rounded-xl transition flex justify-center items-center text-sm shadow-md cursor-pointer"
                          >
                            <Download className="w-4 h-4 mr-2" /> Unduh File Asli
                          </button>
                        ) : (
                          <button 
                            disabled
                            className="w-full bg-slate-100 text-slate-400 font-extrabold py-3 rounded-xl flex justify-center items-center text-sm cursor-not-allowed"
                          >
                            Karya Ditolak
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* --- MODAL POSTING PROYEK BARU (PREMIUM SPLIT LAYOUT) --- */}
      {showPostingForm && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] overflow-hidden shadow-2xl border border-white/40 flex flex-col md:flex-row relative">
            
            {/* Close Button Top Right */}
            <button onClick={() => setShowPostingForm(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm border border-slate-200 hover:bg-slate-100 rounded-full flex justify-center items-center transition cursor-pointer z-10 shadow-sm hover:scale-105">
              <X className="w-5 h-5 text-slate-700" />
            </button>

            {/* Left Side: Visual/Banner */}
            <div className="hidden md:flex flex-col w-2/5 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/freelance7.jpg')] opacity-20 mix-blend-overlay bg-cover bg-center"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 shadow-xl">
                    <Sparkles className="w-7 h-7 text-indigo-200" />
                  </div>
                  <h2 className="text-3xl font-black mb-4 leading-tight">Buat<br/>Peluang Baru.</h2>
                  <p className="text-indigo-100/80 text-sm leading-relaxed font-medium">Temukan talenta mahasiswa terbaik untuk mewujudkan ide kreatif dan menyelesaikan tantangan bisnis UMKM Anda.</p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-sm">Rekber Aman</h3>
                  </div>
                  <p className="text-indigo-200 text-xs">Dana dialokasikan ke Escrow (Rekber) CariCuan hingga pekerjaan selesai dan disetujui.</p>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full md:w-3/5 bg-slate-50 flex flex-col h-full">
              <div className="p-6 md:p-8 border-b border-slate-200 bg-white">
                <h3 className="text-xl font-extrabold text-slate-900">Form Posting Proyek Baru</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Lengkapi detail pekerjaan di bawah ini</p>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <form onSubmit={handlePostingSubmit} className="space-y-6">
                  
                  {/* Informasi Dasar Section */}
                  <div className="space-y-5">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4" /> Informasi Dasar
                    </h4>
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Pekerjaan / Proyek</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Briefcase className="h-5 w-5 text-slate-400" />
                        </div>
                        <input 
                          type="text" 
                          value={formData.judul}
                          onChange={e => setFormData({...formData, judul: e.target.value})}
                          placeholder="Misal: Desain Logo & Banner Sosial Media"
                          className={`w-full pl-11 pr-4 py-3.5 bg-white border ${formError ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-indigo-200'} rounded-xl outline-none focus:ring-4 transition text-sm font-bold text-slate-800 placeholder:text-slate-400 shadow-sm`}
                        />
                      </div>
                      {formError && <p className="text-rose-500 text-xs font-bold mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> {formError}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sistem Pekerjaan</label>
                        <select 
                          value={formData.tipeKerja}
                          onChange={e => setFormData({...formData, tipeKerja: e.target.value})}
                          className="w-full p-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-bold text-slate-800 shadow-sm"
                        >
                          <option>Part-Time (Pekerjaan Berdurasi)</option>
                          <option>Sayembara (Lomba Desain / Karya)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Anggaran / Upah (Rp)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="font-black text-slate-400 text-sm">Rp</span>
                          </div>
                          <input 
                            type="text" 
                            value={formData.budget}
                            onChange={e => setFormData({...formData, budget: e.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')})}
                            placeholder="Misal: 250.000"
                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-bold text-slate-800 placeholder:text-slate-400 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-200/60 my-6"></div>

                  {/* Detail & Visual Section */}
                  <div className="space-y-5">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                      <ImageIcon className="w-4 h-4" /> Detail Pekerjaan & Visual
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Gambar Proyek (Opsional)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({...formData, gambar: reader.result});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-medium text-slate-800 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                      {formData.gambar && (
                        <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                          <img src={formData.gambar} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Pekerjaan</label>
                      <textarea 
                        value={formData.deskripsi}
                        onChange={e => setFormData({...formData, deskripsi: e.target.value})}
                        placeholder="Jelaskan detail tugas, ekspektasi, dan cara kerja yang harus dilakukan mahasiswa..."
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-medium h-32 resize-none shadow-sm"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Persyaratan Khusus (Opsional)</label>
                      <textarea 
                        value={formData.persyaratan}
                        onChange={e => setFormData({...formData, persyaratan: e.target.value})}
                        placeholder="Keahlian, alat, aplikasi yang harus dikuasai, atau kriteria khusus..."
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-medium h-24 resize-none shadow-sm"
                      ></textarea>
                    </div>
                  </div>

                  <div className="pt-4 pb-8">
                    <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 text-white font-extrabold rounded-xl transition-all duration-300 shadow-xl shadow-indigo-600/30 cursor-pointer text-sm flex items-center justify-center gap-2 group">
                      <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      {formData.tipeKerja.includes('Sayembara') ? 'Posting & Alokasikan Rekber' : 'Posting Lowongan Part-Time'}
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-4 font-semibold uppercase tracking-wider">
                      {formData.tipeKerja.includes('Sayembara') 
                        ? 'Anggaran Proyek + Biaya Publikasi (Rp 25.000) akan dipotong dari Dompet UMKM'
                        : 'Hanya Biaya Publikasi (Rp 25.000) yang akan dipotong dari Dompet UMKM'}
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL EDIT PROYEK --- */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h2 className="text-xl font-extrabold text-slate-900">Detail & Edit Proyek</h2>
              <button onClick={() => setEditingProject(null)} className="w-9 h-9 bg-white border border-slate-200 hover:bg-slate-100 rounded-full flex justify-center items-center transition cursor-pointer">
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
            <div className="p-6 sm:p-8 overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Judul Pekerjaan <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={editFormData.judul}
                    onChange={(e) => setEditFormData({...editFormData, judul: e.target.value})}
                    placeholder="Misal: Desain Logo Kedai Kopi"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tipe Kerja <span className="text-rose-500">*</span></label>
                    <select 
                      value={editFormData.tipeKerja}
                      onChange={(e) => setEditFormData({...editFormData, tipeKerja: e.target.value})}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-bold text-slate-800"
                    >
                      <option value="Part-Time">Part-Time</option>
                      <option value="Sayembara">Sayembara</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Budget (Rp) <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      value={editFormData.budget}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setEditFormData({...editFormData, budget: val ? parseInt(val).toLocaleString('id-ID') : ''})
                      }}
                      placeholder="150.000"
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Deskripsi Proyek <span className="text-rose-500">*</span></label>
                  <textarea 
                    value={editFormData.deskripsi}
                    onChange={(e) => setEditFormData({...editFormData, deskripsi: e.target.value})}
                    rows={4}
                    placeholder="Ceritakan detail tugas yang harus dikerjakan..."
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-200 transition text-sm font-medium text-slate-800 placeholder:text-slate-400 resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl transition shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-5 h-5" /> Simpan Perubahan
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleDeleteProject(editingProject)}
                    className="flex-1 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 font-extrabold rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer border border-rose-100"
                  >
                    <Trash2 className="w-5 h-5" /> Hapus Proyek
                  </button>
                </div>
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