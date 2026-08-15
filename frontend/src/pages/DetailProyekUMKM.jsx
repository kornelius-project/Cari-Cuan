import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Briefcase, CheckCircle, X, ShieldCheck, 
  Star, MessageCircle, AlertCircle, FileText, Download, Check
} from 'lucide-react';

export default function DetailProyekUMKM() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [activeTab, setActiveTab] = useState('pelamar'); // 'pelamar' or 'pekerja'
  const [completeModal, setCompleteModal] = useState({ isOpen: false, appId: null, rating: 5, tip: 0, mahasiswaName: '' });
  const [isCompleting, setIsCompleting] = useState(false);
  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/jobs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Gagal mengambil data proyek');
      const data = await response.json();
      setJob(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleTerimaKandidat = async (appId, pelamarName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/applications/${appId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount: 0 }) 
      });
      
      if (response.ok) {
        showToast(`Berhasil merekrut ${pelamarName}!`);
        fetchJobDetail(); // Refresh data
      } else {
        const data = await response.json();
        showToast(data.error || "Gagal merekrut kandidat", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan server saat merekrut", "error");
    }
  };

  const handleTolakKandidat = async (appId, pelamarName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'REJECTED' })
      });
      
      if (response.ok) {
        showToast(`Lamaran dari ${pelamarName} berhasil ditolak.`, "success");
        fetchJobDetail(); // Refresh data
      } else {
        showToast("Gagal menolak kandidat", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan server", "error");
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

  const submitCompleteProject = async () => {
    try {
      setIsCompleting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/applications/${completeModal.appId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating: completeModal.rating, tip: completeModal.tip })
      });
      
      const data = await response.json();
      if (response.ok) {
        showToast(`Berhasil menyelesaikan proyek untuk ${completeModal.mahasiswaName}!`, "success");
        setCompleteModal({ isOpen: false, appId: null, rating: 5, tip: 0, mahasiswaName: '' });
        fetchJobDetail(); // Refresh data
      } else {
        showToast(data.error || "Gagal menyelesaikan proyek", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Terjadi kesalahan server", "error");
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-black text-slate-900 mb-2">Proyek Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6">{error || 'Data proyek tidak dapat dimuat.'}</p>
        <button onClick={() => navigate('/dashboard-umkm')} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const applications = job.applications || [];
  const pendingApplicants = applications.filter(a => a.status === 'MENUNGGU');
  const approvedApplicants = applications.filter(a => a.status === 'APPROVED' || a.status === 'SELESAI');
  const rejectedApplicants = applications.filter(a => a.status === 'REJECTED');

  const getMahasiswaAvatar = (name) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Mahasiswa")}&background=c7d2fe&color=3730a3&bold=true`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Navbar Minimalis */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard-umkm')} className="p-2 hover:bg-slate-100 rounded-full transition text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-extrabold text-lg text-slate-900">Detail Proyek</h1>
          </div>
          <Link to="/dashboard-umkm" className="font-bold text-indigo-600 hover:text-indigo-700 text-sm">
            Dasbor UMKM
          </Link>
        </div>
      </nav>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-20 right-6 z-[9999] animate-in slide-in-from-right-8 fade-in duration-300">
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

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Proyek Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center">
          {job.imageUrl || job.category ? (
            <img 
              src={job.imageUrl || {
                'F&B': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
                'Digital Marketing': 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800',
                'Desain Grafis': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
                'Administrasi': 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
                'Pendidikan': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
                'Jasa': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
                'IT / Web': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
                'Fotografi': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
              }[job.category] || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800"} 
              alt={job.title} 
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0" 
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Briefcase className="w-10 h-10" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${job.isActive ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>
                {job.isActive ? 'Proyek Aktif' : 'Proyek Selesai'}
              </span>
              {job.status === 'open' && (
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-700">
                  Mencari Kandidat
                </span>
              )}
              <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                {job.type}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-600">
              <span>Rp {parseInt(job.salary?.replace(/\D/g, '') || 0).toLocaleString('id-ID')}</span>
              <span className="text-slate-300">•</span>
              <span>{job.category}</span>
              <span className="text-slate-300">•</span>
              <span>{new Date(job.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Proyek Deskripsi */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" /> Deskripsi Pekerjaan
          </h2>
          <div className="prose prose-sm text-slate-700 font-medium whitespace-pre-wrap">
            {job.description}
          </div>
        </div>

        {/* Tab Navigasi Pelamar & Pekerja */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('pelamar')}
              className={`flex-1 py-4 px-6 text-sm font-extrabold transition text-center border-b-2 ${activeTab === 'pelamar' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
            >
              Daftar Pelamar Masuk <span className="ml-2 bg-rose-500 text-white px-2 py-0.5 rounded-full text-[10px]">{pendingApplicants.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('pekerja')}
              className={`flex-1 py-4 px-6 text-sm font-extrabold transition text-center border-b-2 ${activeTab === 'pekerja' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
            >
              Pekerja Terpilih <span className="ml-2 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[10px]">{approvedApplicants.length}</span>
            </button>
          </div>

          <div className="p-6 md:p-8 bg-slate-50/50">
            {activeTab === 'pelamar' && (
              <div className="space-y-4">
                {pendingApplicants.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 font-medium">
                    Belum ada pelamar baru untuk proyek ini.
                  </div>
                ) : (
                  pendingApplicants.map(app => (
                    <div key={app.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-5 items-start">
                      <img src={getMahasiswaAvatar(app.mahasiswa?.name)} alt="Avatar" className="w-16 h-16 rounded-2xl shadow-sm border border-slate-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-extrabold text-lg text-slate-900">{app.mahasiswa?.name || "Mahasiswa Anonim"}</h3>
                          <span className="flex items-center text-amber-500 font-extrabold text-xs">
                            <Star className="w-3.5 h-3.5 mr-1 fill-amber-500" /> 4.8
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-3">{app.mahasiswa?.email}</p>
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pesan / Cover Letter</p>
                          <p className="text-sm text-slate-700 italic">"{app.coverLetter || "Tidak ada pesan."}"</p>
                        </div>

                        {app.submissionUrl && (
                          <div className="mb-4">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lampiran / Karya</p>
                            <a href={app.submissionUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold border border-indigo-100 hover:bg-indigo-100 transition">
                              <FileText className="w-4 h-4" /> Lihat Lampiran
                            </a>
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-2 pt-4 border-t border-slate-100">
                          <button 
                            onClick={() => handleTerimaKandidat(app.id, app.mahasiswa?.name)}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex justify-center items-center gap-2 text-sm"
                          >
                            <Check className="w-4 h-4" /> Terima Kandidat
                          </button>
                          <button 
                            onClick={() => navigate(`/chat?userId=${app.mahasiswaId}`)}
                            className="flex-1 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition flex justify-center items-center gap-2 text-sm border border-indigo-200"
                          >
                            <MessageCircle className="w-4 h-4" /> Chat
                          </button>
                          <button 
                            onClick={() => handleTolakKandidat(app.id, app.mahasiswa?.name)}
                            className="py-3 px-5 bg-white hover:bg-rose-50 text-rose-600 font-bold rounded-xl transition flex justify-center items-center gap-2 text-sm border border-slate-200 hover:border-rose-200"
                          >
                            <X className="w-4 h-4" /> Tolak
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'pekerja' && (
              <div className="space-y-4">
                {approvedApplicants.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 font-medium">
                    Belum ada pekerja yang diterima di proyek ini.
                  </div>
                ) : (
                  approvedApplicants.map(app => (
                    <div key={app.id} className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex flex-col md:flex-row gap-5 items-start">
                      <img src={getMahasiswaAvatar(app.mahasiswa?.name)} alt="Avatar" className="w-16 h-16 rounded-2xl shadow-sm border border-emerald-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3 className="font-extrabold text-lg text-slate-900">{app.mahasiswa?.name || "Mahasiswa Anonim"}</h3>
                            <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${app.status === 'SELESAI' ? 'text-blue-700 bg-blue-100' : 'text-emerald-700 bg-emerald-100'}`}>
                              <ShieldCheck className="w-3 h-3" /> {app.status === 'SELESAI' ? 'Pekerjaan Selesai' : 'Pekerja Terpilih'}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mt-2">{app.mahasiswa?.email}</p>

                        {app.submissionUrl && (
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">File / Hasil Karya</p>
                            <button 
                              onClick={() => handleDownload(app.submissionUrl)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition"
                            >
                              <Download className="w-4 h-4" /> Unduh File Asli
                            </button>
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                           <button 
                            onClick={() => navigate(`/chat?userId=${app.mahasiswaId}`)}
                            className="w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition flex justify-center items-center gap-2 text-sm border border-indigo-200"
                          >
                            <MessageCircle className="w-4 h-4" /> Diskusi dengan Pekerja
                          </button>
                          {app.status === 'APPROVED' && (
                            <button 
                              onClick={() => setCompleteModal({ isOpen: true, appId: app.id, rating: 5, tip: 0, mahasiswaName: app.mahasiswa?.name || 'Mahasiswa' })}
                              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex justify-center items-center gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4" /> Selesaikan Proyek & Bayar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </main>

      {/* MODAL SELESAIKAN PROYEK */}
      {completeModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-xl text-slate-900">Selesaikan Pekerjaan</h3>
              <button 
                onClick={() => setCompleteModal({ isOpen: false, appId: null, rating: 5, tip: 0, mahasiswaName: '' })}
                className="p-2 hover:bg-slate-200 rounded-full transition text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-slate-600 mb-6 text-sm">
                Anda akan menyelesaikan proyek untuk <strong>{completeModal.mahasiswaName}</strong>. 
                Dana upah sebesar <strong>Rp {parseInt(job.salary?.replace(/\D/g, '') || 0).toLocaleString('id-ID')}</strong> akan diteruskan ke pekerja.
              </p>
              
              <div className="space-y-5">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Beri Rating Kinerja</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCompleteModal(prev => ({ ...prev, rating: star }))}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${completeModal.rating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                        />
                      </button>
                    ))}
                    <span className="ml-3 font-bold text-slate-500 text-sm">{completeModal.rating} dari 5 Bintang</span>
                  </div>
                </div>

                {/* Tip */}
                <div>
                  <label className="block text-sm font-extrabold text-slate-900 mb-2">Tambahkan Tip / Bonus (Opsional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                    <input 
                      type="number"
                      min="0"
                      value={completeModal.tip}
                      onChange={(e) => setCompleteModal(prev => ({ ...prev, tip: parseInt(e.target.value) || 0 }))}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none font-bold text-slate-900"
                      placeholder="Contoh: 50000"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Tip akan dipotong dari saldo UMKM Anda dan langsung diberikan ke pekerja.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setCompleteModal({ isOpen: false, appId: null, rating: 5, tip: 0, mahasiswaName: '' })}
                className="flex-1 py-3 text-slate-600 font-bold bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition"
                disabled={isCompleting}
              >
                Batal
              </button>
              <button 
                onClick={submitCompleteProject}
                disabled={isCompleting}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex justify-center items-center gap-2"
              >
                {isCompleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Konfirmasi Selesai
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
