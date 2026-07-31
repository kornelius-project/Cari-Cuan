import React, { useState } from 'react';
import { 
  Store, MapPin, Phone, Mail, Building, 
  Camera, CheckCircle, ShieldCheck, Save, Star, Lock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Tesseract from 'tesseract.js';

export default function ProfilBisnis() {
  const [formData, setFormData] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('umkmProfile')) || {};
    const user = JSON.parse(localStorage.getItem('user')) || {};
    return {
      namaBisnis: saved.namaBisnis || user.name || localStorage.getItem('userName') || '',
      kategori: saved.kategori || '',
      email: saved.email || user.email || '',
      noHp: saved.noHp || '',
      alamat: saved.alamat || '',
      deskripsi: saved.deskripsi || '',
      fotoProfil: saved.fotoProfil || null,
      password: ''
    };
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [kycStatus, setKycStatus] = useState('unverified'); // 'unverified', 'pending', 'verified'
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [kycError, setKycError] = useState('');

  React.useEffect(() => {
    const userStr = localStorage.getItem('user');
    let isVerified = false;
    if (userStr) {
      const user = JSON.parse(userStr);
      isVerified = user.kycStatus === 'VERIFIED';
    }

    if (isVerified) {
      setKycStatus('verified');
    } else {
      setKycStatus('unverified');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, fotoProfil: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Save to localStorage
      localStorage.setItem('umkmProfile', JSON.stringify({
        ...formData,
        password: '' // Don't save password in local storage
      }));
      
      let user = JSON.parse(localStorage.getItem('user')) || {};
      user.name = formData.namaBisnis;
      user.email = formData.email;
      if (formData.password) {
        user.password = formData.password;
      }
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userName', formData.namaBisnis);
      window.dispatchEvent(new Event('storage'));
      
      setFormData(prev => ({ ...prev, password: '' }));

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleKycUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsVerifying(true);
    setVerifyProgress(0);
    setKycError('');
    
    Tesseract.recognize(
      file,
      'ind',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            setVerifyProgress(Math.floor(m.progress * 100));
          } else if (m.status === 'loading tesseract core' || m.status === 'initializing api') {
            setVerifyProgress((prev) => prev < 10 ? prev + 1 : prev);
          }
        }
      }
    ).then(({ data: { text } }) => {
      const upperText = text.toUpperCase();
      const keywords = ['KTP', 'KARTU TANDA PENDUDUK', 'NIK', 'NIB', 'NOMOR INDUK BERUSAHA', 'PROVINSI'];
      const isMatch = keywords.some(kw => upperText.includes(kw));

      if (isMatch) {
        // Panggil backend API agar DB ter-update
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('ktp', file);
        
        fetch('http://localhost:5000/api/users/kyc', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        }).then(res => {
          if (res.ok) {
            setIsVerifying(false);
            setKycStatus('verified');
            localStorage.setItem('kycVerified', 'true');
            let user = { role: localStorage.getItem('userRole') || 'umkm', kycStatus: 'UNVERIFIED' };
            const userStr = localStorage.getItem('user');
            if (userStr) {
              user = JSON.parse(userStr);
            }
            user.kycStatus = 'VERIFIED';
            localStorage.setItem('user', JSON.stringify(user));
            window.dispatchEvent(new Event('storage'));
          } else {
            setIsVerifying(false);
            setKycError('Gagal sinkronisasi dengan server.');
          }
        }).catch(err => {
          setIsVerifying(false);
          setKycError('Terjadi kesalahan koneksi saat verifikasi.');
        });
      } else {
        setIsVerifying(false);
        setKycError('Sistem tidak mengenali ini sebagai KTP atau NIB. Pastikan teks terlihat jelas.');
      }
    }).catch((err) => {
      console.error(err);
      setIsVerifying(false);
      setKycError('Terjadi kesalahan saat memproses gambar. Silakan coba lagi.');
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10">
        
        {/* Header */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Profil Bisnis</h1>
            <p className="text-slate-500 text-lg">Kelola informasi publik UMKM Anda agar terlihat profesional di mata mahasiswa.</p>
          </div>
          {showSuccess && (
            <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold flex items-center animate-in fade-in slide-in-from-top-2 shadow-sm border border-emerald-200">
              <CheckCircle className="w-5 h-5 mr-2" />
              Profil Berhasil Disimpan!
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: Foto & Reputasi */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Foto Profil Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img 
                  src={formData.fotoProfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.namaBisnis || 'UMKM')}&background=c7d2fe&color=3730a3&bold=true&size=200`}
                  alt="Logo Bisnis" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition shadow-lg border-2 border-white cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
              <h2 className="text-xl font-black text-slate-900">{formData.namaBisnis}</h2>
              <p className="text-slate-500 font-medium mb-4">{formData.kategori}</p>
              
              <div className="flex items-center justify-center gap-1 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                0/5 (0 Ulasan)
              </div>
            </div>

            {/* KYC Status Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
                Verifikasi Usaha (KYC)
              </h3>
              
              {kycStatus === 'verified' && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3 relative">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-800 text-sm mb-1">Usaha Terverifikasi</p>
                    <p className="text-xs text-emerald-600 leading-relaxed">NIB / KTP Anda telah divalidasi. Mahasiswa lebih percaya bekerja dengan UMKM terverifikasi.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setKycStatus('unverified');
                      localStorage.removeItem('kycVerified');
                      let user = { role: localStorage.getItem('userRole') || 'umkm', kycStatus: 'VERIFIED' };
                      const userStr = localStorage.getItem('user');
                      if (userStr) {
                        user = JSON.parse(userStr);
                      }
                      user.kycStatus = 'UNVERIFIED';
                      localStorage.setItem('user', JSON.stringify(user));
                      window.dispatchEvent(new Event('storage'));
                    }} 
                    className="absolute top-2 right-2 text-[10px] text-emerald-700 font-bold underline hover:text-emerald-900"
                    title="Hanya untuk keperluan testing"
                  >
                    Reset
                  </button>
                </div>
              )}

              {kycStatus === 'unverified' && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                  <p className="text-sm font-medium text-slate-600 mb-4">Unggah dokumen NIB atau KTP Pemilik untuk mendapatkan lencana Terpercaya.</p>
                  
                  {kycError && (
                    <div className="mb-4 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2 rounded-lg text-left">
                      {kycError}
                    </div>
                  )}

                  {isVerifying ? (
                    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2 mt-4 overflow-hidden">
                      <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${verifyProgress}%` }}></div>
                      <p className="text-xs text-slate-500 mt-2 font-bold">Menganalisis Dokumen... {verifyProgress}%</p>
                    </div>
                  ) : (
                    <label className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-slate-800 transition text-sm cursor-pointer block">
                      Unggah Dokumen
                      <input type="file" accept="image/*" className="hidden" onChange={handleKycUpload} />
                    </label>
                  )}
                </div>
              )}

              {kycStatus === 'pending' && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                  <p className="font-bold text-amber-800 text-sm mb-1">Sedang Direview</p>
                  <p className="text-xs text-amber-600">Dokumen Anda sedang diperiksa oleh tim Cari Cuan (estimasi 1x24 jam).</p>
                </div>
              )}
            </div>

          </div>

          {/* KOLOM KANAN: Form Edit Profil */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
              <form onSubmit={handleSave} className="space-y-6">
                
                <h3 className="text-lg font-black text-slate-900 mb-4 border-b border-slate-100 pb-4">Informasi Dasar</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Store className="w-4 h-4 mr-2 text-slate-400" /> Nama Bisnis/Toko
                    </label>
                    <input 
                      type="text" 
                      name="namaBisnis"
                      value={formData.namaBisnis}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-2 text-slate-400" /> Kategori Industri
                    </label>
                    <select 
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition font-medium text-slate-800"
                    >
                      <option value="" disabled>Pilih Kategori</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Retail & Fashion">Retail & Fashion</option>
                      <option value="Jasa & Layanan">Jasa & Layanan</option>
                      <option value="Teknologi & Digital">Teknologi & Digital</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" /> Email Bisnis
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" /> Nomor WhatsApp
                    </label>
                    <input 
                      type="tel" 
                      name="noHp"
                      value={formData.noHp}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" /> Alamat Lengkap
                    </label>
                    <textarea 
                      name="alamat"
                      value={formData.alamat}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition font-medium resize-none"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-slate-400" /> Ganti Password
                    </label>
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password || ''}
                      onChange={handleChange}
                      placeholder="Kosongkan jika tidak diganti"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Bisnis</label>
                  <p className="text-xs text-slate-500 mb-2">Berikan deskripsi singkat tentang apa yang UMKM Anda lakukan. Ini membantu mahasiswa memahami konteks pekerjaan.</p>
                  <textarea 
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition font-medium resize-none leading-relaxed"
                    required
                  ></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition flex items-center disabled:opacity-50 shadow-md shadow-indigo-600/20"
                  >
                    {isSaving ? (
                      <span className="flex items-center">Menyimpan...</span>
                    ) : (
                      <><Save className="w-5 h-5 mr-2" /> Simpan Perubahan</>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
