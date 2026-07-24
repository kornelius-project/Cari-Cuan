import React, { useState, useEffect, useRef } from 'react';
import { Clock, Shield, UploadCloud, CheckCircle, ChevronLeft, FileText, Send, User, Check, Briefcase, Calendar } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ProyekAktif() {
  const [searchParams] = useSearchParams();
  const tipeKerja = searchParams.get('type') || 'lepas'; // 'lepas' atau 'part-time'
  const isPartTime = tipeKerja === 'part-time';

  // State File Upload (Untuk Proyek Lepas)
  const [fileDraf, setFileDraf] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [terkirim, setTerkirim] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hari: 2, jam: 14, menit: 59 });

  // State Chat
  const [pesan, setPesan] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: "umkm", text: "Halo Budi, selamat bergabung. Apakah brief yang saya berikan sudah cukup jelas?", time: "09:00" },
    { id: 2, sender: "saya", text: "Halo Bapak/Ibu, terima kasih kesempatannya. Brief sangat jelas, saya akan mulai mengerjakannya hari ini.", time: "09:05" }
  ]);
  const chatEndRef = useRef(null);

  // Auto-scroll chat ke bawah
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Timer untuk Proyek Lepas
  useEffect(() => {
    if (isPartTime) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hari, jam, menit } = prev;
        menit -= 1;
        if (menit < 0) { menit = 59; jam -= 1; }
        if (jam < 0) { jam = 23; hari -= 1; }
        return { hari, jam, menit };
      });
    }, 60000); 
    return () => clearInterval(timer);
  }, [isPartTime]);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!fileDraf) {
      setUploadError("Silakan pilih file hasil kerja Anda terlebih dahulu!");
      return;
    }
    setUploadError('');
    
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setTerkirim(true);
      // Auto reply di chat saat upload berhasil
      setChatHistory(prev => [...prev, { 
        id: Date.now(), 
        sender: "saya", 
        text: "Saya sudah mengunggah draf pertama. Silakan ditinjau melalui tombol unduh di sistem.", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }, 2500);
  };

  const handleKirimPesan = (e) => {
    e.preventDefault();
    if (pesan.trim() === "") return;
    setChatHistory([...chatHistory, { 
      id: Date.now(), 
      sender: "saya", 
      text: pesan, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setPesan("");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 h-[calc(100vh-80px)] flex flex-col">
        
        {/* HEADER AREA */}
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
          <Link to="/status-lamaran" className="inline-flex items-center text-gray-500 font-bold hover:text-blue-600 transition">
            <ChevronLeft className="w-5 h-5 mr-1" /> Kembali ke Status Lamaran
          </Link>
        </div>

        {/* HERO CARD RINGKAS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isPartTime ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'}`}>
                {isPartTime ? 'Part-Time' : 'Proyek Lepas'}
              </span>
              <span className="text-gray-500 text-sm font-medium border-l border-gray-300 pl-3">Order ID: #PRJ-88219</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{isPartTime ? 'Admin Sosial Media Instagram' : 'Desain Logo Kedai Kopi'}</h1>
            <p className="text-gray-600 font-medium text-sm">Klien: <span className="font-bold text-gray-900">{isPartTime ? 'Butik Nabila' : 'Kopi Senja'}</span></p>
          </div>
          
          {/* Status Box Berubah Sesuai Tipe */}
          {!isPartTime ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 min-w-[200px] text-center shadow-sm w-full md:w-auto relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-red-200"><div className="h-full bg-red-600 w-[60%]"></div></div>
              <div className="flex justify-center items-center text-red-700 mb-1 mt-1">
                <Clock className="w-4 h-4 mr-1.5" />
                <span className="font-bold text-xs uppercase tracking-wider">Tenggat Waktu</span>
              </div>
              <div className="text-red-700 font-black text-xl">{timeLeft.hari}H : {timeLeft.jam}J : {timeLeft.menit}M</div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 min-w-[200px] text-center shadow-sm w-full md:w-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-green-200"><div className="h-full bg-green-600 w-[40%]"></div></div>
              <div className="flex justify-center items-center text-green-700 mb-1 mt-1">
                <CheckCircle className="w-4 h-4 mr-1.5" />
                <span className="font-bold text-xs uppercase tracking-wider">Status Kontrak</span>
              </div>
              <div className="text-green-700 font-black text-xl">Sedang Berjalan</div>
            </div>
          )}
        </div>

        {/* 2 KOLOM UTAMA (FLEX-1 UNTUK MENGISI SISA TINGGI LAYAR) */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
          
          {/* PANEL KIRI: DETAIL & AKSI (Scrollable independent) */}
          <div className="lg:w-1/2 flex flex-col gap-6 overflow-y-auto pr-2 pb-4">
            
            {/* Kartu Detail Brief / Kontrak */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center text-lg border-b pb-2">
                {isPartTime ? <><Briefcase className="w-5 h-5 mr-2 text-purple-600"/> Rincian Kontrak Part-Time</> : <><FileText className="w-5 h-5 mr-2 text-blue-600"/> Brief Pekerjaan Klien</>}
              </h2>
              
              {!isPartTime ? (
                 <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-700 leading-relaxed italic">"Tolong buatkan logo yang modern dan estetik. Konsep bersih, ada elemen biji kopi, dominan warna coklat tanah serta emas."</p>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2 ml-1">
                    <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"/> Format: PNG & SVG</li>
                    <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0"/> Revisi maksimal 2 kali</li>
                  </ul>
                 </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-500 text-sm">Posisi</span>
                    <span className="font-bold text-gray-900">Admin Sosial Media</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-500 text-sm">Durasi Kontrak</span>
                    <span className="font-bold text-gray-900 flex items-center"><Calendar className="w-4 h-4 mr-1 text-purple-600"/> 1 Bulan</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <span className="text-gray-500 text-sm">Upah Bulanan</span>
                    <span className="font-bold text-green-600">Rp 300.000</span>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mt-2 text-sm text-purple-800">
                    <strong>Tugas Utama:</strong> Membalas DM pelanggan setiap hari (pkl 09:00 - 17:00) dan upload 3 Feed per minggu.
                  </div>
                </div>
              )}
            </div>

            {/* PANEL AKSI (Upload untuk Proyek Lepas, kosong/status untuk Part-time) */}
            {!isPartTime && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Area Serah Terima Karya</h2>
                
                {!terkirim ? (
                  <form onSubmit={handleUpload} className="flex-1 flex flex-col">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-3 mb-4 shadow-sm text-blue-900 text-xs leading-relaxed">
                      <Shield className="w-5 h-5 flex-shrink-0" />
                      <p><strong>Keamanan Aktif:</strong> File Anda akan diburamkan otomatis. UMKM harus menyetujui hasil dan melepas dana sebelum file asli terbuka.</p>
                    </div>

                    <label className={`flex-1 flex flex-col justify-center items-center min-h-[180px] w-full border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer mb-4 ${fileDraf ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}>
                      {fileDraf ? (
                        <div className="animate-in zoom-in duration-200">
                          <CheckCircle className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                          <p className="font-bold text-blue-900 text-sm truncate max-w-[200px]">{fileDraf.name}</p>
                        </div>
                      ) : (
                        <div>
                          <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm font-bold text-gray-800">Pilih File Hasil Kerja</p>
                        </div>
                      )}
                      <input type="file" className="sr-only" onChange={(e) => setFileDraf(e.target.files[0])} />
                    </label>
                    {uploadError && <p className="text-red-500 text-xs font-bold text-center mb-3">{uploadError}</p>}

                    <button disabled={uploading} type="submit" className={`w-full text-white font-bold py-3 rounded-xl transition ${uploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}>
                      {uploading ? 'Memproses...' : 'Kirim Ber-Watermark'}
                    </button>
                  </form>
                ) : (
                  <div className="flex-1 flex flex-col justify-center items-center text-center animate-in fade-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex justify-center items-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Terkirim ke Klien</h3>
                    <p className="text-gray-500 text-sm">Menunggu persetujuan Kopi Senja untuk pencairan dana.</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* PANEL KANAN: LIVE CHAT (Mendominasi sisa ruang) */}
          <div className="lg:w-1/2 bg-white rounded-3xl shadow-md border border-gray-200 flex flex-col overflow-hidden h-[500px] lg:h-full">
            
            {/* Chat Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center gap-4 text-white">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex justify-center items-center font-bold">
                {isPartTime ? 'BN' : 'KS'}
              </div>
              <div>
                <h3 className="font-bold leading-tight">{isPartTime ? 'Butik Nabila' : 'Kopi Senja'}</h3>
                <p className="text-green-400 text-xs flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span> Online</p>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-4">
              {chatHistory.map((chat) => (
                <div key={chat.id} className={`flex ${chat.sender === 'saya' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-5 py-3 shadow-sm relative ${chat.sender === 'saya' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'}`}>
                    <p className="text-sm leading-relaxed">{chat.text}</p>
                    <span className={`text-[10px] absolute bottom-1 ${chat.sender === 'saya' ? 'text-blue-200 right-3' : 'text-gray-400 right-3'}`}>{chat.time}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleKirimPesan} className="flex gap-2">
                <input 
                  type="text" 
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  placeholder="Ketik pesan untuk Klien..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button type="submit" disabled={!pesan.trim()} className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
