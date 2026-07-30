import React, { useState } from 'react';
import { 
  Receipt, ArrowUpRight, ArrowDownRight, Clock, 
  CheckCircle, Download, FileText, Search, Filter 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RiwayatTransaksi() {
  const [filter, setFilter] = useState('Semua');

  const transactions = [
    {
      id: "TRX-20230915-001",
      tanggal: "15 Sep 2023, 14:30",
      deskripsi: "Pembayaran Escrow - Desain Logo Kedai Kopi",
      freelancer: "Menunggu Kandidat",
      nominal: 150000,
      tipe: "Keluar", // Uang masuk ke sistem Escrow
      status: "Tertahan di Escrow"
    },
    {
      id: "TRX-20230910-089",
      tanggal: "10 Sep 2023, 09:15",
      deskripsi: "Pelepasan Dana Escrow - Admin Sosial Media",
      freelancer: "Siti Aminah",
      nominal: 300000,
      tipe: "Selesai", // Dana sudah diteruskan
      status: "Selesai"
    },
    {
      id: "TRX-20230825-042",
      tanggal: "25 Agu 2023, 16:45",
      deskripsi: "Pelepasan Dana Escrow - Pembuatan Website Katalog",
      freelancer: "Andi Saputra",
      nominal: 1500000,
      tipe: "Selesai",
      status: "Selesai"
    },
    {
      id: "TRX-20230801-011",
      tanggal: "01 Agu 2023, 10:00",
      deskripsi: "Pengembalian Dana (Refund) - Proyek Dibatalkan",
      freelancer: "Sistem",
      nominal: 200000,
      tipe: "Masuk", // Uang kembali ke UMKM
      status: "Dikembalikan"
    }
  ];

  const filteredData = filter === 'Semua' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        
        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Riwayat Transaksi</h1>
          <p className="text-slate-500 text-lg">Pantau arus kas, dana Escrow, dan unduh invoice untuk keperluan pembukuan bisnis Anda.</p>
        </header>

        {/* METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
              <Receipt className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-black text-slate-900">Rp 1.950.000</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Tertahan (Escrow)</p>
              <p className="text-2xl font-black text-slate-900">Rp 150.000</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Dana Dikembalikan</p>
              <p className="text-2xl font-black text-slate-900">Rp 200.000</p>
            </div>
          </div>
        </div>

        {/* FILTER & SEARCH */}
        <div className="bg-white rounded-3xl p-2 sm:p-8 shadow-sm border border-slate-100">
          <div className="px-4 pt-4 sm:px-0 sm:pt-0 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
              {['Semua', 'Tertahan di Escrow', 'Selesai', 'Dikembalikan'].map(opt => (
                <button 
                  key={opt}
                  onClick={() => setFilter(opt)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition ${filter === opt ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Cari ID / Deskripsi..." 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold rounded-tl-2xl">ID & Tanggal</th>
                  <th className="px-6 py-4 font-bold">Deskripsi</th>
                  <th className="px-6 py-4 font-bold">Nominal</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right rounded-tr-2xl">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((trx) => (
                  <tr key={trx.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900 text-sm">{trx.id}</p>
                      <p className="text-xs text-slate-500 mt-1">{trx.tanggal}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-800 text-sm">{trx.deskripsi}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <UserIcon className="w-3 h-3 mr-1" /> {trx.freelancer}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className={`font-black ${trx.tipe === 'Masuk' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {trx.tipe === 'Masuk' ? '+' : ''} Rp {trx.nominal.toLocaleString('id-ID')}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={trx.status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="inline-flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition" title="Unduh Invoice">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="font-bold">Tidak ada transaksi ditemukan.</p>
              </div>
            )}
          </div>
        </div>

      </main>
      
      <Footer />
    </div>
  );
}

// Komponen Pembantu
const StatusBadge = ({ status }) => {
  if (status === 'Selesai') return <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Selesai</span>;
  if (status === 'Tertahan di Escrow') return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><Clock className="w-3 h-3 mr-1" /> Escrow</span>;
  if (status === 'Dikembalikan') return <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><ArrowDownRight className="w-3 h-3 mr-1" /> Refund</span>;
  return null;
};

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);
