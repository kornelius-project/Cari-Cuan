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

        <div className="flex flex-col space-y-6">
          {lowonganPublik.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 group">
              
              {/* Gambar UMKM */}
              <div className="w-full md:w-48 h-40 md:h-auto flex-shrink-0 relative overflow-hidden rounded-xl">
                <img src={job.image} alt={job.umkm} className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition duration-500" />
              </div>

              {/* Detail Pekerjaan */}
              <div className="flex-1 py-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">{job.kategori}</span>
                  <span className="text-gray-500 text-sm font-medium flex items-center"><MapPin className="w-3 h-3 mr-1"/> {job.umkm}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.judul}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">{job.deskripsi}</p>
                <div className="flex items-center text-gray-500 text-sm font-medium">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" /> Tenggat Waktu: <span className="ml-1 text-gray-700">{job.waktu}</span>
                </div>
              </div>

              {/* Harga & Tombol */}
              <div className="w-full md:w-48 flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <div className="w-full flex md:flex-col justify-between md:justify-start items-center md:items-end mb-4 md:mb-0">
                  <p className="text-sm text-gray-500 font-medium">Budget Proyek</p>
                  <p className="text-2xl font-black text-green-600">{job.harga}</p>
                </div>
                
                <Link to="/register" className="w-full bg-gray-100 text-gray-600 font-bold py-3 px-4 rounded-xl hover:bg-blue-600 hover:text-white transition flex justify-center items-center group">
                  <Lock className="w-4 h-4 mr-2" /> Login & Lamar
                </Link>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
