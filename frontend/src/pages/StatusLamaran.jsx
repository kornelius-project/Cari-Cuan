import React, { useState, useEffect } from 'react';
import { Briefcase, Clock, XCircle, CheckCircle, ChevronRight, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function StatusLamaran() {
  const [filter, setFilter] = useState('Semua');

  const [lamaran, setLamaran] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLamaran = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        const response = await fetch(`http://localhost:5000/api/applications/mahasiswa/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const mappedData = data.map(app => {
            let statusText = 'Menunggu';
            if (app.status === 'APPROVED') statusText = 'Diterima';
            if (app.status === 'REJECTED') statusText = 'Ditolak';
            
            let pesan = 'Lamaran Anda sudah terkirim dan sedang menunggu keputusan dari pihak UMKM.';
            let link = null;

              if (app.status === 'APPROVED') {
                if (app.job?.type === 'Sayembara') {
                  pesan = 'Selamat! Karya Sayembara Anda telah dipilih oleh UMKM. Dana kompensasi telah berhasil ditransfer ke saldo dompet Anda.';
                  link = null; // Tidak perlu ke proyek aktif karena sudah selesai
                } else {
                  pesan = 'Selamat! UMKM menyetujui lamaran part-time Anda. Silakan koordinasikan pekerjaan melalui Chat.';
                  link = app.job?.umkm?.id ? `/chat?userId=${app.job.umkm.id}` : '/chat';
                }
              }
            if (app.status === 'REJECTED') {
              pesan = 'Mohon maaf, UMKM telah memilih kandidat lain yang lebih sesuai dengan kebutuhan mereka. Tetap semangat!';
            }
            
            return {
              id: app.id,
              judul: app.job?.title || 'Posisi',
              umkm: app.job?.umkm?.name || 'UMKM',
              lokasi: app.job?.location || 'Remote',
              waktuLamar: new Date(app.createdAt).toLocaleDateString(),
              status: statusText,
              pesan: pesan,
              link: link
            };
          });
          setLamaran(mappedData);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLamaran();
  }, []);

  const filteredLamaran = filter === 'Semua' ? lamaran : lamaran.filter(l => l.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto p-6 md:p-10">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Status Lamaran Saya</h1>
          <p className="text-gray-500 mt-1">Lacak semua pekerjaan yang pernah Anda lamar di sini.</p>
        </div>

        {/* TAB FILTER & PENCARIAN */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            {['Semua', 'Menunggu', 'Diterima', 'Ditolak'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-bold transition ${filter === tab ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari lamaran..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
            />
          </div>
        </div>

        {/* DAFTAR LAMARAN */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
              <Clock className="w-10 h-10 text-gray-300 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold text-gray-500">Memuat Lamaran...</h3>
            </div>
          ) : (
            <>
          {filteredLamaran.map((job) => (
            <div key={job.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-6 hover:shadow-md transition">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center ${
                    job.status === 'Diterima' ? 'bg-green-100 text-green-700' :
                    job.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {job.status === 'Diterima' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                    {job.status === 'Menunggu' && <Clock className="w-3.5 h-3.5 mr-1" />}
                    {job.status === 'Ditolak' && <XCircle className="w-3.5 h-3.5 mr-1" />}
                    {job.status}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">Dilamar {job.waktuLamar}</span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">{job.judul}</h2>
                <p className="text-blue-600 font-bold mb-3 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" /> {job.umkm}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-4 font-medium">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {job.lokasi}
                </div>
                
                {/* Kotak Pesan Sistem */}
                <div className={`p-4 rounded-xl border text-sm font-medium leading-relaxed ${
                  job.status === 'Diterima' ? 'bg-green-50 border-green-100 text-green-800' :
                  job.status === 'Menunggu' ? 'bg-gray-50 border-gray-100 text-gray-600' :
                  'bg-red-50 border-red-100 text-red-800'
                }`}>
                  {job.pesan}
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="w-full md:w-auto flex-shrink-0 pt-2">
                {job.status === 'Diterima' && job.link ? (
                  <Link to={job.link} className="w-full md:w-auto block bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 hover:-translate-y-1 transition text-center flex items-center justify-center">
                    Hubungi UMKM (Chat) <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                ) : job.status === 'Ditolak' ? (
                  <Link to="/lowongan" className="w-full md:w-auto block bg-gray-100 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition text-center">
                    Cari Lowongan Lain
                  </Link>
                ) : (
                  <button disabled className="w-full md:w-auto bg-gray-100 text-gray-400 font-bold py-3 px-6 rounded-xl cursor-not-allowed text-center">
                    Menunggu Review
                  </button>
                )}
              </div>

            </div>
          ))}

          {filteredLamaran.length === 0 && (
             <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 border-dashed">
               <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Lamaran</h3>
               <p className="text-gray-500 mb-6">Anda belum memiliki lamaran dengan status '{filter}'.</p>
               <Link to="/lowongan" className="inline-flex bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition">
                 Cari Lowongan Sekarang
               </Link>
              </div>
           )}
           </>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
