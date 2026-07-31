import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, ShieldCheck, CreditCard, UploadCloud, CheckCircle, Plus, X, Briefcase, Link as LinkIcon, Award, Trash2, Edit3, Save, MapPin, GraduationCap, Camera, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import Webcam from 'react-webcam';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilMahasiswa() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profesional');
  const [ktmUploaded, setKtmUploaded] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [isTakingSelfie, setIsTakingSelfie] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [kycError, setKycError] = useState('');

  // --- STATE KEUANGAN ---
  const [rekening, setRekening] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('mahasiswaRekening'));
    return saved || {
      metode: "Bank BCA",
      nomor: ""
    };
  });

  useEffect(() => {
    localStorage.setItem('mahasiswaRekening', JSON.stringify(rekening));
  }, [rekening]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'kyc') {
      setActiveTab('kyc');
    }

    // Initialize from local storage first for instant UI
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.kycStatus === 'VERIFIED') {
        setKycVerified(true);
        setKtmUploaded(true);
        setSelfieTaken(true);
      }
    }

    // Sync with backend to fix any fake/stale localStorage state
    const syncUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('user', JSON.stringify(data));
          window.dispatchEvent(new Event('storage'));
          if (data.kycStatus === 'VERIFIED') {
            setKycVerified(true);
            setKtmUploaded(true);
            setSelfieTaken(true);
          } else {
            // Reset if DB says UNVERIFIED
            setKycVerified(false);
            setKtmUploaded(false);
            setSelfieTaken(false);
          }
        }
      } catch (err) {
        console.error("Failed to sync user data", err);
      }
    };
    syncUser();

  }, [location]);

  // --- STATE PROFIL UTAMA ---
  const userName = localStorage.getItem('userName') || '';
  const [profileData, setProfileData] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('mahasiswaProfile'));
    return saved || {
      nama: userName,
      jurusan: "",
      headline: "",
      tentang: "",
      avatar: "",
      cover: ""
    };
  });
  
  useEffect(() => {
    localStorage.setItem('mahasiswaProfile', JSON.stringify(profileData));
  }, [profileData]);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [editForm, setEditForm] = useState({ ...profileData });

  useEffect(() => {
    setEditForm(profileData);
  }, [profileData]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileData(editForm);
    setIsEditingProfile(false);
    handleSave();
  };

  const handleSaveAbout = () => {
    setProfileData({ ...profileData, tentang: editForm.tentang });
    setIsEditingAbout(false);
    handleSave();
  }

  // --- STATE KEAHLIAN ---
  const [skills, setSkills] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('mahasiswaSkills'));
    return saved || [];
  });

  useEffect(() => {
    localStorage.setItem('mahasiswaSkills', JSON.stringify(skills));
  }, [skills]);

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
  const [pengalaman, setPengalaman] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('mahasiswaPengalaman'));
    return saved || [];
  });

  useEffect(() => {
    localStorage.setItem('mahasiswaPengalaman', JSON.stringify(pengalaman));
  }, [pengalaman]);

  const [isAddingExp, setIsAddingExp] = useState(false);
  const [newExp, setNewExp] = useState({ posisi: "", institusi: "", durasi: "", deskripsi: "", logo: "" });

  const handleAddExp = (e) => {
    e.preventDefault();
    setPengalaman([...pengalaman, { id: Date.now(), ...newExp }]);
    setNewExp({ posisi: "", institusi: "", durasi: "", deskripsi: "", logo: "" });
    setIsAddingExp(false);
  };
  
  const handleExpLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewExp({ ...newExp, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveExp = (id) => {
    setPengalaman(pengalaman.filter(exp => exp.id !== id));
  };

  // --- STATE PORTOFOLIO ---
  const [portofolio, setPortofolio] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('mahasiswaPortofolio'));
    return saved || [];
  });

  useEffect(() => {
    localStorage.setItem('mahasiswaPortofolio', JSON.stringify(portofolio));
  }, [portofolio]);

  const [isAddingPort, setIsAddingPort] = useState(false);
  const [newPort, setNewPort] = useState({ judul: "", kategori: "", link: "", deskripsi: "", image: "" });

  const handleAddPort = (e) => {
    e.preventDefault();
    const imgToSave = newPort.image || "/freelance5.png";
    setPortofolio([...portofolio, { id: Date.now(), ...newPort, image: imgToSave }]);
    setNewPort({ judul: "", kategori: "", link: "", deskripsi: "", image: "" });
    setIsAddingPort(false);
  };

  const handlePortImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPort({ ...newPort, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemovePort = (id) => {
    setPortofolio(portofolio.filter(port => port.id !== id));
  };

  // --- HANDLERS ---
  const handleSave = async (e) => {
    if(e) e.preventDefault();
    if(activeTab === 'kyc') {
      if (!ktmUploaded || !selfieTaken) {
        setKycError("Mohon selesaikan langkah 1 (Unggah KTM) dan Langkah 2 (Selfie) sebelum menyimpan.");
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        // Convert base64 to Blob
        const fetchResponse = await fetch(ktmUploaded);
        const blob = await fetchResponse.blob();
        formData.append('ktp', blob, 'ktm.jpg');
        
        const response = await fetch('http://localhost:5000/api/users/kyc', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (response.ok) {
          setKycVerified(true);
          setKycError('');
          
          let user = { role: localStorage.getItem('userRole') || 'mahasiswa', kycStatus: 'UNVERIFIED' };
          const userStr = localStorage.getItem('user');
          if (userStr) {
            user = JSON.parse(userStr);
          }
          user.kycStatus = 'VERIFIED';
          localStorage.setItem('user', JSON.stringify(user));
          window.dispatchEvent(new Event('storage'));
        } else {
          const err = await response.json();
          setKycError(err.error || 'Gagal memverifikasi KYC');
          return;
        }
      } catch (err) {
        console.error(err);
        setKycError('Terjadi kesalahan pada server');
        return;
      }
    }
    setKycError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsVerifying(true);
    setVerifyProgress(0);
    setKtmUploaded(false);
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
      const keywords = ['MAHASISWA', 'UNIVERSITAS', 'INSTITUT', 'POLITEKNIK', 'KARTU TANDA', 'KTM', 'NIM', 'NPM'];
      const isMatch = keywords.some(kw => upperText.includes(kw));

      if (isMatch) {
        setIsVerifying(false);
        setKtmUploaded(true);
      } else {
        setIsVerifying(false);
        setKtmUploaded(false);
        setKycError('Sistem tidak dapat mengenali ini sebagai KTM. Pastikan teks "KARTU MAHASISWA" / "UNIVERSITAS" terlihat jelas.');
      }
    }).catch((err) => {
      console.error(err);
      setIsVerifying(false);
      setKtmUploaded(false);
      setKycError('Terjadi kesalahan saat memproses gambar OCR. Silakan coba gambar resolusi kecil.');
    });
  };

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setIsTakingSelfie(false);
        setSelfieTaken(true);
      }
    }
  }, [webcamRef]);

  const handleTakeSelfie = () => {
    setIsTakingSelfie(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 pb-12">
      <Navbar />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8">
        
        {saved && (
          <div className="mb-6 bg-green-50 text-green-700 px-4 py-3 rounded-xl border border-green-200 flex items-center shadow-sm animate-in fade-in zoom-in duration-300">
            <CheckCircle className="w-5 h-5 mr-2" /> Data berhasil disimpan ke sistem!
          </div>
        )}

        {/* HEADER PROFIL (LinkedIn Style) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          
          {/* Cover Photo */}
          <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-700 to-indigo-800 relative group overflow-hidden">
            {profileData.cover && <img src={profileData.cover} alt="Cover" className="w-full h-full object-cover" />}
            <button className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition shadow-sm">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Info Area */}
          <div className="px-6 pb-6 relative">
            <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
              
              {/* Avatar Box */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden relative group shadow-md flex-shrink-0">
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
                <div onClick={() => setIsEditingProfile(true)} className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer transition">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button onClick={() => setIsEditingProfile(true)} className="flex items-center gap-2 border border-gray-300 text-gray-700 font-bold px-4 py-2 rounded-full hover:bg-gray-50 transition text-sm">
                  <Edit3 className="w-4 h-4" /> <span className="hidden sm:inline">Edit Profil</span>
                </button>
              </div>
            </div>

            {/* Profile Texts */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{profileData.nama || 'Pengguna Tanpa Nama'}</h1>
                {kycVerified && <ShieldCheck className="w-6 h-6 text-blue-600" title="Terverifikasi KYC" />}
              </div>
              
              <p className="text-gray-700 sm:text-lg mb-2">
                {profileData.headline ? profileData.headline : <span className="italic text-gray-400 text-sm">Tambahkan Headline / Spesialisasi Anda...</span>}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center"><GraduationCap className="w-4 h-4 mr-1" /> {profileData.jurusan || "Belum memasukkan Universitas"}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Indonesia</span>
              </div>

              {/* Gamification badge */}
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 px-3 py-1.5 rounded-full shadow-sm">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-[10px] font-black text-yellow-800 uppercase tracking-wide">Pemula Baru</span>
              </div>
            </div>
          </div>

          {/* TAB NAVIGATION HORIZONTAL */}
          <div className="border-t border-gray-100 flex overflow-x-auto custom-scrollbar">
            <button 
              onClick={() => setActiveTab('profesional')} 
              className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'profesional' ? 'border-blue-600 text-blue-700 bg-blue-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Profil Profesional
            </button>
            <button 
              onClick={() => setActiveTab('kyc')} 
              className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-colors whitespace-nowrap px-4 flex items-center justify-center gap-2 ${activeTab === 'kyc' ? 'border-blue-600 text-blue-700 bg-blue-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Verifikasi KYC {kycVerified ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            </button>
            <button 
              onClick={() => setActiveTab('keuangan')} 
              className={`flex-1 py-4 font-bold text-sm text-center border-b-2 transition-colors whitespace-nowrap px-4 ${activeTab === 'keuangan' ? 'border-blue-600 text-blue-700 bg-blue-50/30' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Rekening Pencairan
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}
        
        {/* 1. PROFIL PROFESIONAL */}
        {activeTab === 'profesional' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
            
            {/* Left/Main Column */}
            <div className="md:col-span-2 space-y-6">
              
              {/* TENTANG SAYA */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 group relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Tentang Saya</h2>
                  {!isEditingAbout && (
                    <button onClick={() => {setEditForm({...editForm, tentang: profileData.tentang}); setIsEditingAbout(true);}} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition opacity-0 group-hover:opacity-100">
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {isEditingAbout ? (
                  <div>
                    <textarea 
                      rows="4" 
                      value={editForm.tentang}
                      onChange={(e) => setEditForm({...editForm, tentang: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                      placeholder="Ceritakan tentang diri Anda, minat, dan apa yang bisa Anda tawarkan..."
                    ></textarea>
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setIsEditingAbout(false)} className="px-4 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-lg text-sm">Batal</button>
                      <button onClick={handleSaveAbout} className="px-4 py-2 font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm flex items-center"><Save className="w-4 h-4 mr-1"/> Simpan</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {profileData.tentang ? profileData.tentang : <span className="italic text-gray-400">Belum ada deskripsi tentang diri Anda. Klik ikon pensil untuk menambahkan.</span>}
                  </p>
                )}
              </div>

              {/* PENGALAMAN */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Pengalaman Organisasi / Kerja</h2>
                  <button onClick={() => setIsAddingExp(!isAddingExp)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
                    {isAddingExp ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>

                {isAddingExp && (
                  <form onSubmit={handleAddExp} className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 mb-6 animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Logo / Gambar Organisasi (Opsional)</label>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden">
                            {newExp.logo ? (
                              <img src={newExp.logo} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <input type="file" accept="image/*" onChange={handleExpLogoChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Posisi / Jabatan</label>
                        <input required type="text" value={newExp.posisi} onChange={e => setNewExp({...newExp, posisi: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Nama Organisasi</label>
                        <input required type="text" value={newExp.institusi} onChange={e => setNewExp({...newExp, institusi: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Rentang Waktu</label>
                        <input required type="text" value={newExp.durasi} onChange={e => setNewExp({...newExp, durasi: e.target.value})} placeholder="Cth: Jan 2024 - Sekarang" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Tugas</label>
                      <textarea required rows="2" value={newExp.deskripsi} onChange={e => setNewExp({...newExp, deskripsi: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Simpan Pengalaman</button>
                    </div>
                  </form>
                )}

                <div className="space-y-6">
                  {pengalaman.length > 0 ? pengalaman.map((exp, index) => (
                    <div key={exp.id} className={`relative flex gap-4 ${index !== pengalaman.length - 1 ? 'pb-6 border-b border-gray-100' : ''}`}>
                      <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {exp.logo ? (
                          <img src={exp.logo} alt={exp.institusi} className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg">{exp.posisi}</h4>
                            <p className="text-gray-800 font-medium text-sm">{exp.institusi}</p>
                            <p className="text-gray-500 text-xs mt-1 mb-2">{exp.durasi}</p>
                          </div>
                          <button onClick={() => handleRemoveExp(exp.id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4"/></button>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{exp.deskripsi}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-400 italic text-sm text-center py-4">Belum ada pengalaman yang ditambahkan.</p>
                  )}
                </div>
              </div>

              {/* PORTOFOLIO / PROYEK UNGGULAN */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Proyek Unggulan (Portofolio)</h2>
                  <button onClick={() => setIsAddingPort(!isAddingPort)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
                    {isAddingPort ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>

                {isAddingPort && (
                  <form onSubmit={handleAddPort} className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 mb-6 animate-in fade-in">
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Unggah Gambar Proyek / Thumbnail</label>
                      <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg px-6 pt-5 pb-6 flex justify-center bg-white relative">
                        {newPort.image ? (
                          <img src={newPort.image} alt="Preview" className="h-32 object-contain" />
                        ) : (
                          <div className="space-y-1 text-center">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                Pilih gambar
                              </span>
                            </div>
                          </div>
                        )}
                        <input type="file" accept="image/*" onChange={handlePortImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Judul Proyek</label>
                        <input required type="text" value={newPort.judul} onChange={e => setNewPort({...newPort, judul: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                        <input required type="text" value={newPort.kategori} onChange={e => setNewPort({...newPort, kategori: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tautan Karya (opsional)</label>
                        <input type="text" value={newPort.link} onChange={e => setNewPort({...newPort, link: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi Singkat</label>
                      <textarea required rows="2" value={newPort.deskripsi} onChange={e => setNewPort({...newPort, deskripsi: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700">Unggah Proyek</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {portofolio.length > 0 ? portofolio.map(port => (
                    <div key={port.id} className="border border-gray-200 rounded-xl overflow-hidden group">
                      <div className="h-32 bg-gray-100 relative overflow-hidden">
                        <img src={port.image} alt={port.judul} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <button onClick={() => handleRemovePort(port.id)} className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition shadow-sm"><Trash2 className="w-4 h-4"/></button>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">{port.kategori}</p>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{port.judul}</h4>
                        <p className="text-gray-500 text-xs line-clamp-2">{port.deskripsi}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-400 italic text-sm py-2 col-span-2 text-center">Belum ada proyek yang ditambahkan.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right/Sidebar Column */}
            <div className="space-y-6">
              
              {/* KEAHLIAN / SKILLS */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Keahlian (Skills)</h2>
                  <button onClick={() => setIsAddingSkill(!isAddingSkill)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition">
                    {isAddingSkill ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>

                {isAddingSkill && (
                  <div className="flex items-center gap-2 mb-4">
                    <input 
                      type="text" autoFocus placeholder="Cth: Copywriting" 
                      value={newSkillText} onChange={(e) => setNewSkillText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                    />
                    <button onClick={handleAddSkill} className="bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700"><CheckCircle className="w-4 h-4"/></button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {skills.length > 0 ? skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 text-xs font-bold px-3 py-1.5 rounded-full flex items-center group">
                      {skill} 
                      <button onClick={() => handleRemoveSkill(idx)} className="ml-1.5 text-blue-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><X className="w-3 h-3"/></button>
                    </span>
                  )) : (
                    <p className="text-gray-400 italic text-sm">Tidak ada keahlian dicantumkan.</p>
                  )}
                </div>
              </div>

              {/* TAUTAN PROFESIONAL */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Tautan</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <LinkIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 italic">Belum menautkan LinkedIn/Web</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. TAB KYC */}
        {activeTab === 'kyc' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in duration-300 max-w-3xl mx-auto">
             <div className="mb-8 border-b border-gray-100 pb-4 text-center">
                <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-2xl font-extrabold text-gray-900">Keamanan & KYC</h2>
                <p className="text-gray-500 mt-1">Verifikasi identitas Anda sebagai mahasiswa asli.</p>
              </div>

              {kycVerified ? (
                  <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center shadow-sm animate-in zoom-in duration-500">
                    <ShieldCheck className="w-20 h-20 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-black text-green-900 mb-2">Identitas Terverifikasi</h3>
                    <p className="text-green-800 max-w-md mx-auto text-sm">Selamat! Anda telah diverifikasi. Anda kini dapat melamar pekerjaan dan menarik dana.</p>
                  </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Langkah 1: Unggah Kartu Tanda Mahasiswa (KTM)</label>
                    <label className={`block w-full border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer relative overflow-hidden ${ktmUploaded ? 'border-green-400 bg-green-50' : isVerifying ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-gray-50'}`}>
                      {isVerifying ? (
                        <div className="flex flex-col items-center py-4">
                          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                          <p className="font-bold text-blue-900 mb-2 text-sm">Proses verifikasi...</p>
                          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mb-1">
                            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${verifyProgress}%` }}></div>
                          </div>
                          <p className="text-xs text-blue-600 font-bold">{verifyProgress}% OCR</p>
                        </div>
                      ) : ktmUploaded ? (
                        <div>
                          <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                          <p className="font-bold text-green-700 mb-1">KTM Diterima (Valid)</p>
                          <p className="text-xs text-green-600">Sistem mendeteksi tulisan Universitas/Mahasiswa</p>
                        </div>
                      ) : (
                        <div>
                          <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                          <p className="font-bold text-gray-700">Pilih File Gambar KTM</p>
                          <p className="text-xs text-gray-500 mt-1">Sistem AI akan membaca teks secara otomatis</p>
                        </div>
                      )}
                      <input type="file" className="sr-only" onChange={handleFileUpload} accept="image/*" disabled={isVerifying} />
                    </label>
                  </div>

                  {ktmUploaded && (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-500 pt-4 border-t border-gray-100">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Langkah 2: Verifikasi Wajah (Selfie)</label>
                      <div className={`w-full rounded-2xl p-6 text-center transition ${selfieTaken ? 'bg-green-50 border border-green-200' : 'bg-gray-100 border border-gray-200'}`}>
                        {selfieTaken ? (
                          <div className="py-2">
                            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2"/>
                            <p className="font-bold text-green-700">Wajah Cocok dengan KTM</p>
                          </div>
                        ) : isTakingSelfie ? (
                          <div className="py-2 w-full max-w-sm mx-auto">
                            <Webcam
                              audio={false}
                              ref={webcamRef}
                              screenshotFormat="image/jpeg"
                              className="w-full rounded-xl shadow-md mb-4"
                            />
                            <button type="button" onClick={capture} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-md w-full">
                              Ambil Foto Wajah
                            </button>
                            <button type="button" onClick={() => setIsTakingSelfie(false)} className="text-gray-500 text-sm font-bold mt-3 py-2 w-full hover:bg-gray-200 rounded-lg transition">
                              Batal
                            </button>
                          </div>
                        ) : (
                          <div className="py-4">
                            <button type="button" onClick={handleTakeSelfie} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-6 rounded-lg transition shadow-md">
                              Buka Kamera Selfie
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <button type="submit" className={`w-full font-bold py-4 px-8 rounded-xl shadow-md transition ${ktmUploaded && selfieTaken ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    Simpan KYC
                  </button>
                  {kycError && (
                    <div className="mt-2 text-red-500 text-sm font-bold text-center flex items-center justify-center animate-in fade-in">
                      <AlertCircle className="w-4 h-4 mr-1.5" /> {kycError}
                    </div>
                  )}
                </form>
              )}
          </div>
        )}

        {/* 3. TAB KEUANGAN */}
        {activeTab === 'keuangan' && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 animate-in fade-in duration-300 max-w-xl mx-auto">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">Rekening Pencairan</h2>
              <p className="text-gray-500 text-sm mt-1">Pilih tujuan transfer untuk mencairkan uang.</p>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Metode Pencairan</label>
                <select 
                  value={rekening.metode}
                  onChange={(e) => setRekening({...rekening, metode: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm"
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" 
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700">Simpan Rekening</button>
            </form>
          </div>
        )}

      </main>

      {/* MODAL EDIT PROFIL UTAMA */}
      {isEditingProfile && (
        <div className="fixed inset-0 bg-gray-900/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="border-b border-gray-100 p-5 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Edit Profil Utama</h3>
              <button onClick={() => setIsEditingProfile(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-full transition">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div className="flex justify-center mb-4">
                <label className="relative cursor-pointer group block">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-100 bg-gray-50 overflow-hidden relative">
                    {editForm.avatar ? (
                      <img src={editForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    )}
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-blue-500 text-sm" 
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Headline Profil (Spesialisasi)</label>
                <input 
                  type="text" 
                  value={editForm.headline} 
                  onChange={e => setEditForm({...editForm, headline: e.target.value})}
                  placeholder="Cth: Desainer Grafis Lepas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-blue-500 text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Fakultas / Universitas</label>
                <input 
                  type="text" 
                  value={editForm.jurusan} 
                  onChange={e => setEditForm({...editForm, jurusan: e.target.value})}
                  placeholder="Cth: Ilmu Komputer, Universitas Terbuka"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-blue-500 text-sm" 
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700 mt-6">
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
