import React from 'react';
import { Briefcase, ChevronLeft, MapPin, Clock, Lock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LowonganPublik() {
  const lowonganPublik = [
    { 
      id: 1, 
      judul: "Desain Logo Kedai Kopi", 
      harga: "Rp 150.000", 
      waktu: "3 Hari", 
      umkm: "Kopi Senja", 
      kategori: "Desain Grafis",
      image: "/freelance3.png",
      deskripsi: "Kami membutuhkan desainer kreatif untuk merombak logo kedai kopi kami agar terlihat lebih modern, kekinian, dan cocok untuk dicetak di gelas plastik."
    },
    { 
      id: 2, 
      judul: "Admin Sosial Media (Seminggu)", 
      harga: "Rp 300.000", 
      waktu: "7 Hari", 
      umkm: "Toko Baju Nabila", 
      kategori: "Digital Marketing",
      image: "/freelance4.png",
      deskripsi: "Dicari mahasiswa yang paham algoritma Instagram dan TikTok untuk membalas DM, membuat caption, dan memposting konten selama 7 hari berturut-turut."
    },
    { 
      id: 3, 
      judul: "Sebar 100 Brosur di Kampus", 
      harga: "Rp 100.000", 
      waktu: "1 Hari", 
      umkm: "Bimbel Juara", 
      kategori: "Jasa Fisik",
      image: "/freelance5.png",
      deskripsi: "Tugas lapangan: Menyebarkan 100 lembar brosur bimbingan belajar kepada mahasiswa baru di area fakultas atau kantin. Bukti berupa foto dokumentasi."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* Navbar Simple */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center text-gray-500 hover:text-blue-600 transition mr-4">
            <ChevronLeft className="w-5 h-5 mr-1" /> Beranda
          </Link>
          <Briefcase className="w-6 h-6 text-blue-600 hidden sm:block" />
          <span className="text-xl font-bold tracking-tight hidden sm:block">Cari<span className="text-blue-600">Cuan</span></span>
        </div>

        {/* Menu Navigasi (Harus Login) */}
        <div className="hidden md:flex space-x-6 font-medium text-gray-600 text-sm">
          <Link to="/register" className="hover:text-blue-600 transition">Cari Proyek</Link>
          <Link to="/register" className="hover:text-blue-600 transition">Portofolio Saya</Link>
          <Link to="/register" className="hover:text-blue-600 transition">Pencairan Dana</Link>
        </div>

        <div className="space-x-3">
          <Link to="/register" className="text-gray-600 font-medium hover:text-blue-600 transition text-sm">Masuk</Link>
          <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700 transition shadow-sm text-sm">
            Daftar
          </Link>
        </div>
      </nav>

      {/* Konten Utama */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Pekerjaan Terbaru di Sekitar Anda</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">Jelajahi kesempatan freelance nyata dari UMKM lokal. Anda harus memiliki akun terverifikasi untuk melamar!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lowonganPublik.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full hover:-translate-y-1">
              
              {/* Gambar UMKM (Cover Image) */}
              <div className="w-full aspect-[4/3] bg-gray-100 relative overflow-hidden border-b border-gray-100">
                <img src={job.image} alt={job.umkm} className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
                
                {/* Kategori Badge Overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="font-extrabold px-3 py-1.5 rounded-lg text-xs shadow-md backdrop-blur-md border bg-white/95 text-gray-800 border-white">
                    {job.kategori}
                  </span>
                </div>
              </div>

              {/* Detail Pekerjaan */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-extrabold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition">{job.judul}</h3>
                
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[10px] uppercase border border-blue-100 shrink-0">
                    {job.umkm.charAt(0)}
                  </div>
                  <p className="text-sm font-bold text-gray-700 truncate">{job.umkm}</p>
                </div>
                
                <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed flex-1 mb-4">{job.deskripsi}</p>
                
                <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-4">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-gray-400" /> {job.waktu}</span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" /> Remote</span>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Budget Proyek</p>
                    <p className="text-base font-black text-green-600">{job.harga}</p>
                  </div>
                  
                  <Link to="/register" className="w-full bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition flex justify-center items-center group/btn shadow-sm border border-gray-100 hover:border-blue-600">
                    <Lock className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" /> Login & Lamar
                  </Link>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
