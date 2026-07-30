import React, { useState } from 'react';
import { Trophy, Medal, Star, TrendingUp, ChevronDown, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Leaderboard() {
  const [kategori, setKategori] = useState('Bulan Ini');

  const top3 = [
    { peringkat: 2, nama: "Siti Nurhaliza", fakultas: "Fakultas Ekonomika dan Bisnis", poin: 4200, proyek: 12, avatar: "https://i.pravatar.cc/150?img=5" },
    { peringkat: 1, nama: "Budi Santoso", fakultas: "Fakultas Teknologi Informasi", poin: 5800, proyek: 15, avatar: "https://i.pravatar.cc/150?img=11" },
    { peringkat: 3, nama: "Andi Wijaya", fakultas: "Fakultas Bahasa dan Seni", poin: 3950, proyek: 9, avatar: "https://i.pravatar.cc/150?img=8" }
  ];

  const others = [
    { peringkat: 4, nama: "Rina Kumala", fakultas: "Fakultas Pertanian", poin: 3100, proyek: 8, avatar: "https://i.pravatar.cc/150?img=9" },
    { peringkat: 5, nama: "Dewi Lestari", fakultas: "Fakultas Hukum", poin: 2850, proyek: 7, avatar: "https://i.pravatar.cc/150?img=21" },
    { peringkat: 6, nama: "Kornelius C.", fakultas: "Fakultas Teknologi Informasi", poin: 2400, proyek: 5, avatar: "https://i.pravatar.cc/150?img=33" },
    { peringkat: 7, nama: "Ahmad Fauzi", fakultas: "Fakultas Teknik", poin: 2150, proyek: 4, avatar: "https://i.pravatar.cc/150?img=12" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10">
        
        {/* Header Gamifikasi */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full mb-4 shadow-sm border border-yellow-200">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Papan Peringkat Mahasiswa</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Berkompetisi secara sehat! Selesaikan proyek dengan nilai sempurna untuk meraih posisi puncak dan dapatkan badge eksklusif "Top Freelancer".
          </p>
          
          <div className="mt-8 flex justify-center gap-2">
            {['Bulan Ini', 'Semester Ini', 'Sepanjang Waktu'].map(tab => (
              <button 
                key={tab}
                onClick={() => setKategori(tab)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition shadow-sm ${kategori === tab ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {/* Info Cara Mendapat XP */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 max-w-3xl mx-auto flex items-start sm:items-center text-left gap-4">
            <div className="bg-blue-600 text-white p-2 rounded-full hidden sm:block">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-1">Bagaimana cara mendapatkan XP (Experience Points)?</p>
              <p className="text-xs text-blue-800 leading-relaxed">
                <span className="font-bold">100 XP</span> untuk setiap proyek/part-time yang diselesaikan, ditambah <span className="font-bold">50 XP</span> per Bintang Rating dari UMKM. Mahasiswa yang masuk dalam **Top 10** bulan ini akan menerima <span className="font-bold">Lencana Eksklusif</span> yang otomatis dipajang di Profil mereka!
              </p>
            </div>
          </div>
        </div>

        {/* PODIUM TOP 3 */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-6 mb-16 px-4">
          
          {/* Juara 2 */}
          <div className="w-full md:w-1/3 flex flex-col items-center order-2 md:order-1">
            <div className="relative mb-4">
              <img src={top3[0].avatar} alt={top3[0].nama} className="w-24 h-24 rounded-full border-4 border-gray-300 shadow-lg object-cover" />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-gray-800 font-black shadow-sm">
                2
              </div>
            </div>
            <div className="bg-white border-t-4 border-gray-300 rounded-t-2xl shadow-md w-full pt-6 pb-8 px-4 text-center transform md:translate-y-8">
              <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{top3[0].nama}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-1">{top3[0].fakultas}</p>
              <div className="bg-gray-50 rounded-xl py-2 px-3 inline-block">
                <span className="text-gray-900 font-black flex items-center justify-center"><Star className="w-4 h-4 text-yellow-500 mr-1"/> {top3[0].poin} XP</span>
              </div>
            </div>
          </div>

          {/* Juara 1 */}
          <div className="w-full md:w-1/3 flex flex-col items-center order-1 md:order-2 z-10">
            <div className="relative mb-6">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Award className="w-10 h-10 text-yellow-500 drop-shadow-md" />
              </div>
              <img src={top3[1].avatar} alt={top3[1].nama} className="w-32 h-32 rounded-full border-4 border-yellow-400 shadow-xl object-cover ring-4 ring-yellow-100" />
              <div className="absolute -bottom-4 -right-2 w-12 h-12 bg-yellow-400 rounded-full border-4 border-white flex items-center justify-center text-yellow-900 font-black text-xl shadow-md">
                1
              </div>
            </div>
            <div className="bg-white border-t-4 border-yellow-400 rounded-t-2xl shadow-xl w-full pt-8 pb-12 px-4 text-center relative">
              <h3 className="font-black text-gray-900 text-xl line-clamp-1">{top3[1].nama}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-1">{top3[1].fakultas}</p>
              <div className="bg-yellow-50 rounded-xl py-2 px-4 inline-block border border-yellow-100">
                <span className="text-yellow-700 font-black flex items-center justify-center text-lg"><Star className="w-5 h-5 text-yellow-500 mr-1"/> {top3[1].poin} XP</span>
              </div>
            </div>
          </div>

          {/* Juara 3 */}
          <div className="w-full md:w-1/3 flex flex-col items-center order-3 md:order-3">
            <div className="relative mb-4">
              <img src={top3[2].avatar} alt={top3[2].nama} className="w-24 h-24 rounded-full border-4 border-orange-300 shadow-lg object-cover" />
              <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-orange-300 rounded-full border-4 border-white flex items-center justify-center text-orange-900 font-black shadow-sm">
                3
              </div>
            </div>
            <div className="bg-white border-t-4 border-orange-300 rounded-t-2xl shadow-md w-full pt-6 pb-6 px-4 text-center transform md:translate-y-12">
              <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{top3[2].nama}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-1">{top3[2].fakultas}</p>
              <div className="bg-orange-50 rounded-xl py-2 px-3 inline-block">
                <span className="text-orange-800 font-black flex items-center justify-center"><Star className="w-4 h-4 text-orange-500 mr-1"/> {top3[2].poin} XP</span>
              </div>
            </div>
          </div>

        </div>

        {/* LIST PERINGKAT 4-10 */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" /> Peringkat Mahasiswa Lainnya
            </h3>
            <button className="text-sm font-bold text-blue-600 hover:underline flex items-center">
              Fakultas Saya <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {others.map((user) => (
              <div key={user.peringkat} className={`p-4 sm:p-6 flex items-center gap-4 hover:bg-gray-50 transition ${user.nama.includes('Kornelius') ? 'bg-blue-50/50' : ''}`}>
                <div className="w-8 font-black text-gray-400 text-lg text-center flex-shrink-0">
                  {user.peringkat}
                </div>
                
                <img src={user.avatar} alt={user.nama} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {user.nama} {user.nama.includes('Kornelius') && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Anda</span>}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{user.fakultas}</p>
                </div>
                
                <div className="hidden sm:block text-right pr-8">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">Proyek</p>
                  <p className="font-bold text-gray-700">{user.proyek} Selesai</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-0.5">Skor</p>
                  <p className="font-black text-gray-900 flex items-center justify-end"><Star className="w-3.5 h-3.5 text-yellow-500 mr-1"/> {user.poin}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-100 text-center bg-gray-50">
            <button className="text-sm font-bold text-blue-600 hover:underline">Tampilkan Lebih Banyak</button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
