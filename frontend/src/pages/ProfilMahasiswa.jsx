import React, { useState, useEffect } from 'react';
import { User, ShieldCheck, CreditCard, ChevronLeft, UploadCloud, CheckCircle, Plus, X, Briefcase, Link as LinkIcon, Award, Trash2, Edit3, Save, Mail, Phone, MapPin, GraduationCap, Building2, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilMahasiswa() {
  const [activeTab, setActiveTab] = useState('profesional');
  const [ktmUploaded, setKtmUploaded] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [isTakingSelfie, setIsTakingSelfie] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [kycError, setKycError] = useState(''); // Error state inline

  // --- STATE KEUANGAN ---
  const [rekening, setRekening] = useState({
    metode: "Bank BCA",
    nomor: ""
  });

  useEffect(() => {
    if (localStorage.getItem('kycVerified') === 'true') {
      setKycVerified(true);
      setKtmUploaded(true);
      setSelfieTaken(true);
    }
  }, []);

  // --- STATE PROFIL UTAMA ---
  const [profileData, setProfileData] = useState({
    nama: "Kornelius Candra",
    jurusan: "Ilmu Komunikasi • UKSW",
    avatar: "https://i.pravatar.cc/150?img=33"
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ ...profileData });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileData(editForm);
    setIsEditingProfile(false);
    handleSave();
  };

  // --- STATE KEAHLIAN ---
  const [skills, setSkills] = useState(["Sosial Media", "Desain Grafis"]);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillText, setNewSkillText] = useState("");

  const handleAddSkill = () => {
    if (newSkillText.trim() !== "") {
      setSkills([...skills, newSkillText]);
      setNewSkillText("");
      setIsAddingSkill(false);
    }
  };
  const handleRemoveSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  // --- STATE PENGALAMAN ---
  const [pengalaman, setPengalaman] = useState([
    { id: 1, posisi: "Koordinator Publikasi & Dokumentasi", institusi: "Panitia OSPEK UKSW 2025", durasi: "Agu 2025 - Sep 2025", deskripsi: "Memimpin tim berisi 5 orang untuk mendesain seluruh kebutuhan visual acara dan mengelola media sosial dengan peningkatan engagement 40%." },
    { id: 2, posisi: "Freelance Social Media Admin", institusi: "Kafe Kopi Susu Salatiga", durasi: "Jan 2026 - Saat ini", deskripsi: "Bertanggung jawab atas jadwal posting harian, membalas komentar pelanggan, dan membuat konten Reels seminggu sekali." }
  ]);
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [newExp, setNewExp] = useState({ posisi: "", institusi: "", durasi: "", deskripsi: "" });

  const handleAddExp = (e) => {
    e.preventDefault();
    setPengalaman([...pengalaman, { id: Date.now(), ...newExp }]);
    setNewExp({ posisi: "", institusi: "", durasi: "", deskripsi: "" });
    setIsAddingExp(false);
  };
  const handleRemoveExp = (id) => {
    setPengalaman(pengalaman.filter(exp => exp.id !== id));
  };

  // --- STATE PORTOFOLIO ---
  const [portofolio, setPortofolio] = useState([
    { id: 1, judul: "Desain UI/X Aplikasi Edukasi", kategori: "Desain Grafis", link: "behance.net/budi", deskripsi: "Mendesain antarmuka pengguna untuk aplikasi pembelajaran jarak jauh dengan fokus pada kemudahan navigasi.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80" },
    { id: 2, judul: "Fotografi Menu Makanan Lokal", kategori: "Fotografi", link: "instagram.com/budi.lens", deskripsi: "Sesi pemotretan produk makanan untuk warung makan lokal Salatiga untuk kebutuhan menu GoFood.", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=300&q=80" }
  ]);
  const [isAddingPort, setIsAddingPort] = useState(false);
  const [newPort, setNewPort] = useState({ judul: "", kategori: "", link: "", deskripsi: "", image: "" });

  const handleAddPort = (e) => {
    e.preventDefault();
    // Default fallback image if none provided
    const imgToSave = newPort.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80";
    setPortofolio([...portofolio, { id: Date.now(), ...newPort, image: imgToSave }]);
    setNewPort({ judul: "", kategori: "", link: "", deskripsi: "", image: "" });
    setIsAddingPort(false);
  };
  const handleRemovePort = (id) => {
    setPortofolio(portofolio.filter(port => port.id !== id));
  };

  // --- SAVE HANDLER UMUM ---
  const handleSave = (e) => {
    if(e) e.preventDefault();
    if(activeTab === 'kyc' && ktmUploaded && selfieTaken) {
      setKycVerified(true);
      setKycError('');
      localStorage.setItem('kycVerified', 'true');
    } else if (activeTab === 'kyc') {
      // Jika salah satu belum lengkap
      if (!ktmUploaded || !selfieTaken) {
        setKycError("Mohon selesaikan langkah 1 (Unggah KTM) dan Langkah 2 (Selfie) sebelum menyimpan.");
        return;
      }
    }
    setKycError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // --- MOCK AI VERIFICATION HANDLER ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mulai simulasi AI Scanning
    setIsVerifying(true);
    setVerifyProgress(0);
    setKtmUploaded(false);
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5; // Naik random 5-20%
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsVerifying(false);
          setKtmUploaded(true);
        }, 500);
      }
      setVerifyProgress(progress);
    }, 300);
  };

  // --- MOCK CAMERA HANDLER ---
  const handleTakeSelfie = () => {
    setIsTakingSelfie(true);
    setTimeout(() => {
      setIsTakingSelfie(false);
      setSelfieTaken(true);
    }, 2000);
  };

  // --- AVATAR UPLOAD HANDLER ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditForm({ ...editForm, avatar: imageUrl });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR NAVIGASI PROFIL */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <Link to="/dashboard" className="inline-flex items-center text-gray-500 font-bold hover:text-blue-600 transition mb-6">
            <ChevronLeft className="w-5 h-5 mr-1" /> Kembali ke Dasbor
          </Link>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            <div className="p-6 bg-blue-900 text-white text-center relative">
              <button onClick={() => setIsEditingProfile(true)} className="absolute top-4 right-4 bg-white/20 p-1.5 rounded-full hover:bg-white/40 transition">
                <Edit3 className="w-4 h-4 text-white" />
              </button>
              <div className="w-24 h-24 rounded-full flex justify-center items-center mx-auto mb-4 shadow-md border-4 border-white overflow-hidden bg-blue-100">
                <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-xl font-extrabold mb-1">{profileData.nama}</h2>
              
              {/* GAMIFICATION BADGE (BARU) */}
              <div className="mt-2 mb-3 inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 px-3 py-1 rounded-full shadow-sm">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-[10px] font-black text-yellow-800 uppercase tracking-wide">Top 10 Freelancer</span>
              </div>

              <p className="text-blue-200 text-sm">{profileData.jurusan}</p>
              
              {kycVerified ? (
                <div className="mt-4 inline-flex items-center bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Terverifikasi
                </div>
              ) : (
                <div className="mt-4 inline-flex items-center bg-yellow-500 text-blue-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  <AlertCircle className="w-4 h-4 mr-1" /> KYC Pending
                </div>
              )}
            </div>

            <div className="flex flex-col py-2">
              <button 
                onClick={() => setActiveTab('kyc')}
                className={`flex items-center px-6 py-4 font-bold text-sm transition-colors border-l-4 ${activeTab === 'kyc' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
              >
                <ShieldCheck className="w-5 h-5 mr-3" /> Verifikasi KYC (KTM)
              </button>
              <button 
                onClick={() => setActiveTab('keuangan')}
                className={`flex items-center px-6 py-4 font-bold text-sm transition-colors border-l-4 ${activeTab === 'keuangan' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
              >
                <CreditCard className="w-5 h-5 mr-3" /> Rekening Pencairan
              </button>
              <button 
                onClick={() => setActiveTab('profesional')}
                className={`flex items-center px-6 py-4 font-bold text-sm transition-colors border-l-4 ${activeTab === 'profesional' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
              >
                <Briefcase className="w-5 h-5 mr-3" /> Profil Profesional
              </button>
            </div>
          </div>
        </aside>

        {/* AREA KONTEN UTAMA */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-10 min-h-[500px]">
            
            {saved && (
              <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 flex items-center shadow-sm animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-5 h-5 mr-2" /> Data berhasil disimpan ke sistem!
              </div>
            )}

            {/* TAB 1: KYC */}
            {activeTab === 'kyc' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900">Verifikasi Keamanan (KYC)</h2>
                  <p className="text-gray-500 mt-1">Unggah identitas resmi Anda agar UMKM merasa aman bertransaksi.</p>
                </div>
                {kycVerified ? (
                  <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center shadow-sm mt-8 animate-in zoom-in duration-500">
                    <ShieldCheck className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-black text-green-900 mb-3">Identitas Terverifikasi</h3>
                    <p className="text-green-800 text-lg max-w-lg mx-auto">Selamat! Dokumen KTM dan wajah biometrik Anda telah divalidasi oleh sistem keamanan kami. Anda kini bebas melamar pekerjaan dan menarik dana.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap (Sesuai KTP/KTM)</label>
                      <input type="text" defaultValue={profileData.nama} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Induk Mahasiswa (NIM)</label>
                      <input type="text" placeholder="Contoh: 362024001" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Unggah Foto Kartu Tanda Mahasiswa (KTM)</label>
                    <label className={`block w-full border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer relative overflow-hidden ${ktmUploaded ? 'border-green-400 bg-green-50' : isVerifying ? 'border-blue-400 bg-blue-50' : 'border-blue-300 hover:border-blue-500 bg-blue-50/30'}`}>
                      
                      {isVerifying ? (
                        <div className="flex flex-col items-center py-4">
                          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                          <p className="font-bold text-blue-900 mb-2">AI sedang menganalisis dokumen...</p>
                          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-1">
                            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${verifyProgress}%` }}></div>
                          </div>
                          <p className="text-xs text-blue-600 font-bold">{verifyProgress}% - Mencari Wajah & Teks</p>
                        </div>
                      ) : ktmUploaded ? (
                        <div>
                          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                          <p className="font-bold text-green-700 mb-1">KTM Terdeteksi & Valid</p>
                          <div className="bg-white/80 p-3 rounded-lg inline-block text-left shadow-sm border border-green-200 mt-2">
                            <p className="text-xs text-gray-600"><span className="font-bold text-green-600">✓</span> Wajah Mahasiswa Cocok (98%)</p>
                            <p className="text-xs text-gray-600"><span className="font-bold text-green-600">✓</span> Logo Universitas Valid</p>
                            <p className="text-xs text-gray-600"><span className="font-bold text-green-600">✓</span> Teks Terbaca Jelas (OCR)</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <UploadCloud className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                          <p className="font-bold text-blue-900">Klik untuk mengunggah foto KTM</p>
                          <p className="text-xs text-gray-500 mt-2">Sistem AI kami akan memindai wajah dan keaslian kartu Anda secara otomatis.</p>
                        </div>
                      )}
                      <input type="file" className="sr-only" onChange={handleFileUpload} accept="image/*" disabled={isVerifying} />
                    </label>
                  </div>

                  {/* LANGKAH 2: VERIFIKASI WAJAH */}
                  {ktmUploaded && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-4 border-t border-gray-100">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Langkah 2: Verifikasi Wajah (Selfie)</label>
                      <div className={`w-full rounded-2xl p-6 text-center transition relative overflow-hidden ${selfieTaken ? 'bg-green-50 border-2 border-green-400' : 'bg-gray-900 border-2 border-gray-800'}`}>
                        {selfieTaken ? (
                          <div className="py-4">
                            <div className="w-20 h-20 mx-auto rounded-full border-4 border-green-500 overflow-hidden mb-3">
                              <img src={profileData.avatar} alt="Selfie Result" className="w-full h-full object-cover" />
                            </div>
                            <p className="font-bold text-green-700 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 mr-1"/> Wajah Cocok dengan KTM</p>
                          </div>
                        ) : isTakingSelfie ? (
                          <div className="py-10">
                            <div className="w-20 h-20 mx-auto border-4 border-dashed border-white rounded-full animate-spin mb-3 opacity-50"></div>
                            <p className="font-bold text-white mb-1">Menganalisis Titik Wajah (Biometrik)...</p>
                            <p className="text-xs text-gray-400">Pastikan wajah Anda berada di dalam bingkai.</p>
                          </div>
                        ) : (
                          <div className="py-8">
                            <User className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                            <p className="text-gray-300 text-sm mb-4">Silakan menghadap kamera dengan pencahayaan yang cukup.</p>
                            <button 
                              type="button" 
                              onClick={handleTakeSelfie}
                              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-lg inline-flex items-center"
                            >
                              Buka Kamera & Ambil Foto
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button type="submit" className={`w-full font-bold py-4 px-8 rounded-xl shadow-md transition ${ktmUploaded && selfieTaken ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 hover:bg-gray-400'}`}>
                    {ktmUploaded && selfieTaken ? 'Simpan Verifikasi KYC' : 'Mohon Selesaikan Langkah Verifikasi'}
                  </button>
                  {kycError && (
                    <div className="mt-2 text-red-500 text-sm font-bold text-center flex items-center justify-center animate-in fade-in duration-300">
                      <AlertCircle className="w-4 h-4 mr-1.5" /> {kycError}
                    </div>
                  )}
                </form>
                )}
              </div>
            )}

            {/* TAB 2: KEUANGAN */}
            {activeTab === 'keuangan' && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-8 border-b border-gray-100 pb-4">
                  <h2 className="text-2xl font-extrabold text-gray-900">Rekening Pencairan</h2>
                  <p className="text-gray-500 mt-1">Pilih tujuan transfer untuk mencairkan uang hasil kerja Anda.</p>
                </div>
                <form onSubmit={handleSave} className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Metode Pencairan</label>
                    <select 
                      value={rekening.metode}
                      onChange={(e) => setRekening({...rekening, metode: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Bank BCA">Bank BCA</option>
                      <option value="Bank Mandiri">Bank Mandiri</option>
                      <option value="GoPay">GoPay</option>
                      <option value="OVO">OVO</option>
                      <option value="DANA">DANA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Rekening / No. HP E-Wallet</label>
                    <input 
                      type="text" 
                      value={rekening.nomor}
                      onChange={(e) => setRekening({...rekening, nomor: e.target.value})}
                      placeholder="Contoh: 08123456789" 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-blue-700">Simpan Rekening</button>
                </form>
              </div>
            )}

            {/* TAB 3: PROFIL PROFESIONAL */}
            {activeTab === 'profesional' && (
              <div className="animate-in fade-in duration-300 space-y-10">
                
                {/* HEADER TAB */}
                <div className="border-b border-gray-100 pb-4 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Profil Profesional</h2>
                    <p className="text-gray-500 mt-1">Bangun kredibilitas Anda. Data ini akan ditampilkan kepada UMKM.</p>
                  </div>
                  <button onClick={handleSave} className="hidden md:flex bg-blue-600 text-white font-bold py-2 px-6 rounded-xl shadow-md hover:bg-blue-700 transition">
                    Simpan Profil
                  </button>
                </div>

                {/* 1. KEAHLIAN & TAUTAN PROFESIONAL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center"><Award className="w-5 h-5 mr-2 text-blue-600"/> Keahlian (Skills)</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-sm font-bold px-4 py-1.5 rounded-full flex items-center border border-blue-200">
                          {skill} <button onClick={() => handleRemoveSkill(idx)} className="ml-2 hover:text-red-500"><X className="w-3 h-3"/></button>
                        </span>
                      ))}
                    </div>

                    {isAddingSkill ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input 
                          type="text" 
                          autoFocus
                          placeholder="Misal: Copywriting" 
                          value={newSkillText}
                          onChange={(e) => setNewSkillText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                          className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500 w-full"
                        />
                        <button onClick={handleAddSkill} className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700"><CheckCircle className="w-4 h-4"/></button>
                        <button onClick={() => setIsAddingSkill(false)} className="bg-gray-200 text-gray-600 p-1.5 rounded-lg hover:bg-gray-300"><X className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <button onClick={() => setIsAddingSkill(true)} className="text-sm font-bold text-blue-600 hover:underline flex items-center">
                        <Plus className="w-4 h-4 mr-1"/> Tambah Keahlian
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center mb-3"><LinkIcon className="w-5 h-5 mr-2 text-blue-600"/> Tautan Profesional</h3>
                    <div className="space-y-3">
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-blue-500">
                        <span className="text-sm font-bold text-gray-500 border-r border-gray-200 pr-3 mr-3">LinkedIn</span>
                        <input type="text" defaultValue="linkedin.com/in/budisantoso" className="w-full bg-transparent py-2 text-sm outline-none font-medium text-gray-700" />
                      </div>
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-blue-500">
                        <span className="text-sm font-bold text-gray-500 border-r border-gray-200 pr-3 mr-3">Portofolio</span>
                        <input type="text" placeholder="behance.net/budi (Opsional)" className="w-full bg-transparent py-2 text-sm outline-none font-medium text-gray-700" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. RINGKASAN DIRI (ABOUT) */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Ringkasan Diri (Tentang Saya)</h3>
                  <textarea 
                    rows="4" 
                    defaultValue="Mahasiswa Ilmu Komunikasi yang antusias dengan dunia pemasaran digital. Berpengalaman dalam mengelola sosial media kepanitiaan dan mendesain kebutuhan visual acara. Siap membantu UMKM meningkatkan kehadiran digital mereka."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-700 leading-relaxed"
                  ></textarea>
                </div>

                {/* 3. PENGALAMAN (EXPERIENCE) */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Pengalaman (Organisasi / Kerja)</h3>
                    {!isAddingExp && (
                      <button onClick={() => setIsAddingExp(true)} className="text-sm font-bold text-blue-600 hover:underline flex items-center">
                        <Plus className="w-4 h-4 mr-1"/> Tambah Pengalaman
                      </button>
                    )}
                  </div>
                  
                  {isAddingExp && (
                    <form onSubmit={handleAddExp} className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 mb-4 animate-in fade-in slide-in-from-top-2">
                      <h4 className="font-bold text-blue-900 mb-4">Tambah Pengalaman Baru</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Posisi / Jabatan</label>
                          <input required type="text" value={newExp.posisi} onChange={e => setNewExp({...newExp, posisi: e.target.value})} placeholder="Contoh: Ketua Divisi Acara" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Nama Organisasi / Perusahaan</label>
                          <input required type="text" value={newExp.institusi} onChange={e => setNewExp({...newExp, institusi: e.target.value})} placeholder="Contoh: BEM Fakultas" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Rentang Waktu</label>
                          <input required type="text" value={newExp.durasi} onChange={e => setNewExp({...newExp, durasi: e.target.value})} placeholder="Contoh: Agt 2024 - Sekarang" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Tugas</label>
                        <textarea required rows="2" value={newExp.deskripsi} onChange={e => setNewExp({...newExp, deskripsi: e.target.value})} placeholder="Jelaskan apa yang Anda lakukan..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsAddingExp(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                        <button type="submit" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center"><Save className="w-4 h-4 mr-1"/> Simpan</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {pengalaman.map(exp => (
                      <div key={exp.id} className="bg-white border border-gray-200 rounded-2xl p-5 relative group hover:border-blue-300 transition shadow-sm">
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition flex gap-2">
                          <button onClick={() => handleRemoveExp(exp.id)} className="text-gray-400 hover:text-red-500 bg-white p-1 rounded-full"><Trash2 className="w-4 h-4"/></button>
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg">{exp.posisi}</h4>
                        <p className="text-blue-600 font-medium text-sm mb-1">{exp.institusi}</p>
                        <p className="text-gray-400 text-xs font-bold mb-3">{exp.durasi}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{exp.deskripsi}</p>
                      </div>
                    ))}
                    {pengalaman.length === 0 && <p className="text-gray-400 italic text-sm">Belum ada pengalaman yang ditambahkan.</p>}
                  </div>
                </div>

                {/* 4. PROYEK UNGGULAN (FEATURED PROJECTS) */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Proyek Unggulan (Featured)</h3>
                    {!isAddingPort && (
                      <button onClick={() => setIsAddingPort(true)} className="text-sm font-bold text-blue-600 hover:underline flex items-center">
                        <Plus className="w-4 h-4 mr-1"/> Tambah Proyek
                      </button>
                    )}
                  </div>
                  
                  {isAddingPort && (
                    <form onSubmit={handleAddPort} className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 mb-6 animate-in fade-in slide-in-from-top-2">
                      <h4 className="font-bold text-blue-900 mb-4">Unggah Proyek Baru</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Judul Proyek</label>
                          <input required type="text" value={newPort.judul} onChange={e => setNewPort({...newPort, judul: e.target.value})} placeholder="Contoh: Desain Brosur Event" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Kategori (Keahlian)</label>
                          <input required type="text" value={newPort.kategori} onChange={e => setNewPort({...newPort, kategori: e.target.value})} placeholder="Contoh: Desain Grafis" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 mb-1">Tautan Karya (Link GDrive/Web)</label>
                          <input type="text" value={newPort.link} onChange={e => setNewPort({...newPort, link: e.target.value})} placeholder="opsional..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat</label>
                          <textarea required rows="2" value={newPort.deskripsi} onChange={e => setNewPort({...newPort, deskripsi: e.target.value})} placeholder="Ceritakan sedikit tentang proyek ini..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsAddingPort(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
                        <button type="submit" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center"><Save className="w-4 h-4 mr-1"/> Unggah Proyek</button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portofolio.map(port => (
                      <div key={port.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden group hover:border-blue-300 transition shadow-sm flex flex-col relative">
                         <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition">
                          <button onClick={() => handleRemovePort(port.id)} className="bg-white/80 backdrop-blur-sm text-red-500 p-1.5 rounded-full hover:bg-white shadow-sm"><Trash2 className="w-4 h-4"/></button>
                        </div>
                        <div className="h-40 overflow-hidden relative">
                          <img src={port.image} alt={port.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
                            {port.kategori}
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-2">{port.judul}</h4>
                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">{port.deskripsi}</p>
                          </div>
                          <a href={`https://${port.link}`} target="_blank" rel="noreferrer" className="text-blue-600 text-sm font-bold flex items-center hover:underline">
                            <LinkIcon className="w-4 h-4 mr-1"/> Lihat Detail Lengkap
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                  {portofolio.length === 0 && !isAddingPort && <p className="text-gray-400 italic text-sm mt-2">Belum ada portofolio unggulan yang dipajang.</p>}
                </div>

                <button onClick={handleSave} className="w-full md:hidden bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md mt-6">
                  Simpan Profil Profesional
                </button>

              </div>
            )}

          </div>
        </div>

      </main>

      {/* MODAL EDIT PROFIL */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Edit Profil Utama</h3>
              <button onClick={() => setIsEditingProfile(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <label className="relative cursor-pointer group block">
                  <img src={editForm.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-gray-100 object-cover bg-white" />
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                     <UploadCloud className="w-6 h-6 text-white" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nama Tampilan</label>
                <input 
                  type="text" 
                  value={editForm.nama} 
                  onChange={e => setEditForm({...editForm, nama: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Fakultas / Universitas</label>
                <input 
                  type="text" 
                  value={editForm.jurusan} 
                  onChange={e => setEditForm({...editForm, jurusan: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 mt-4">
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
