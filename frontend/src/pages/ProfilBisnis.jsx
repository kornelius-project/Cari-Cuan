import React, { useState } from 'react';
import { 
  Store, MapPin, Phone, Mail, Building, 
  Camera, CheckCircle, ShieldCheck, Save, Star
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilBisnis() {
  const [formData, setFormData] = useState({
    namaBisnis: 'Kopi Senja',
    kategori: 'Food & Beverage',
    email: 'hello@kopisenja.com',
    noHp: '081234567890',
    alamat: 'Jl. Merdeka No. 45, Salatiga',
    deskripsi: 'Kedai kopi lokal yang fokus pada pemberdayaan petani kopi Nusantara. Kami sering membutuhkan bantuan desain dan admin media sosial.'
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [kycStatus, setKycStatus] = useState('verified'); // 'unverified', 'pending', 'verified'
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleVerifyKYC = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setKycStatus('pending');
    }, 1500);
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
                  src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=200&q=80" 
                  alt="Logo Bisnis" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 shadow-md"
                />
                <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition shadow-lg border-2 border-white">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-black text-slate-900">{formData.namaBisnis}</h2>
              <p className="text-slate-500 font-medium mb-4">{formData.kategori}</p>
              
              <div className="flex items-center justify-center gap-1 bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full font-bold text-sm">
                <Star className="w-4 h-4 fill-current" />
                4.9/5 (12 Ulasan)
              </div>
            </div>

            {/* KYC Status Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-indigo-600" />
                Verifikasi Usaha (KYC)
              </h3>
              
              {kycStatus === 'verified' && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-800 text-sm mb-1">Usaha Terverifikasi</p>
                    <p className="text-xs text-emerald-600 leading-relaxed">NIB / KTP Anda telah divalidasi. Mahasiswa lebih percaya bekerja dengan UMKM terverifikasi.</p>
                  </div>
                </div>
              )}

              {kycStatus === 'unverified' && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                  <p className="text-sm font-medium text-slate-600 mb-4">Unggah dokumen NIB atau KTP Pemilik untuk mendapatkan lencana Terpercaya.</p>
                  <button 
                    onClick={handleVerifyKYC}
                    disabled={isVerifying}
                    className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-bold hover:bg-slate-800 transition text-sm disabled:opacity-50"
                  >
                    {isVerifying ? 'Mengunggah...' : 'Verifikasi Sekarang'}
                  </button>
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
