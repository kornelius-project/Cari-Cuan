import React, { useState, useEffect } from 'react';
import { 
  Receipt, ArrowUpRight, ArrowDownRight, Clock, 
  CheckCircle, Download, FileText, Search, Filter 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RiwayatTransaksi() {
  const [filter, setFilter] = useState('Semua');

  const [transactions, setTransactions] = useState([]);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch('http://localhost:5000/api/wallet', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          const rawTrx = data.transactions || [];
          const mappedTrx = rawTrx.map(t => ({
            id: t.id,
            tanggal: t.createdAt,
            keterangan: t.description,
            jenis: (t.type === 'Topup' || t.type === 'Income') ? 'Masuk' : (t.type === 'Info' ? 'Info' : 'Keluar'),
            nominal: t.amount
          }));
          setTransactions(mappedTrx);
          const totalOut = mappedTrx
            .filter(t => t.jenis === 'Keluar')
            .reduce((sum, t) => sum + t.nominal, 0);
          setTotalPengeluaran(totalOut);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchWallet();
  }, []);

  const filteredData = filter === 'Semua' 
    ? transactions 
    : transactions.filter(t => t.jenis === filter);

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
              <p className="text-2xl font-black text-slate-900">Rp {totalPengeluaran.toLocaleString('id-ID')}</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Tertahan (Escrow)</p>
              <p className="text-2xl font-black text-slate-900">Rp 0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Dana Dikembalikan</p>
              <p className="text-2xl font-black text-slate-900">Rp 0</p>
            </div>
          </div>
        </div>

        {/* FILTER & SEARCH */}
        <div className="bg-white rounded-3xl p-2 sm:p-8 shadow-sm border border-slate-100">
          <div className="px-4 pt-4 sm:px-0 sm:pt-0 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl">
              {['Semua', 'Masuk', 'Keluar'].map(opt => (
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
                      <p className="text-xs text-slate-500 mt-1">{new Date(trx.tanggal).toLocaleString('id-ID')}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-800 text-sm">{trx.keterangan}</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <UserIcon className="w-3 h-3 mr-1" /> Sistem / Rekber
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p className={`font-black ${trx.jenis === 'Masuk' ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {trx.jenis === 'Masuk' ? '+' : ''} Rp {trx.nominal.toLocaleString('id-ID')}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={trx.jenis === 'Masuk' ? 'Selesai' : 'Selesai'} />
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
