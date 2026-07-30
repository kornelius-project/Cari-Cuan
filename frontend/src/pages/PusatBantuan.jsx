import React, { useState } from 'react';
import { Search, HelpCircle, ShieldAlert, CreditCard, ChevronDown, ChevronUp, MessageSquare, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PusatBantuan() {
  const [openFaq, setOpenFaq] = useState(1);
  const [ticketSent, setTicketSent] = useState(false);

  const faqs = [
    {
      id: 1,
      kategori: 'Keuangan',
      tanya: "Bagaimana cara menarik dana dari sistem Escrow?",
      jawab: "Setelah UMKM menyetujui hasil kerja Anda, dana akan otomatis masuk ke 'Saldo Tersedia' di Dasbor Keuangan Anda. Anda dapat mengklik tombol 'Tarik Dana', memasukkan nominal, dan dana akan ditransfer ke rekening bank yang telah Anda daftarkan di Profil maksimal 1x24 jam kerja."
    },
    {
      id: 2,
      kategori: 'Keamanan',
      tanya: "Bagaimana jika UMKM menolak membayar hasil kerja saya?",
      jawab: "Sistem Escrow kami mengharuskan UMKM menyetor uang ke pihak ketiga (Cari Cuan) sebelum Anda mulai bekerja. Jika Anda sudah menyerahkan hasil kerja namun UMKM menolak tanpa alasan yang jelas, Anda dapat menekan tombol 'Ajukan Sengketa'. Tim penengah kami akan meninjau bukti kerja Anda dan melepaskan dana jika Anda terbukti benar."
    },
    {
      id: 3,
      kategori: 'Akun',
      tanya: "Bagaimana cara meningkatkan skor profil mahasiswa saya?",
      jawab: "Skor profil Anda dinilai dari kelengkapan data diri (KTM, Foto, Bio), jumlah portofolio yang diunggah, dan rating bintang dari UMKM. Pastikan Anda melengkapi profil 100% dan selalu menjaga komunikasi yang baik dengan klien."
    },
    {
      id: 4,
      kategori: 'Pekerjaan',
      tanya: "Apakah saya bisa membatalkan pekerjaan Part-Time yang sedang berjalan?",
      jawab: "Ya, Anda bisa mengundurkan diri dengan memberikan notifikasi minimal 7 hari sebelum berhenti. Pembayaran akan dihitung secara proporsional (prorata) berdasarkan jumlah hari Anda bekerja."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section Bantuan */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black mb-4">Pusat Bantuan & Layanan</h1>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Temukan jawaban atas pertanyaan Anda, atau hubungi tim dukungan kami jika Anda mengalami kendala selama berkolaborasi.</p>
          
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
            <input 
              type="text" 
              placeholder="Ketik masalah Anda (contoh: cara tarik uang)..." 
              className="w-full pl-14 pr-6 py-4 rounded-2xl text-gray-900 text-lg shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-10 -mt-10 relative z-10">
        
        {/* Kolom FAQ Kiri */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
              <HelpCircle className="w-6 h-6 mr-2 text-blue-600" /> Pertanyaan Populer (FAQ)
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition"
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1 block">{faq.kategori}</span>
                      <span className="font-bold text-gray-900">{faq.tanya}</span>
                    </div>
                    {openFaq === faq.id ? <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 py-5 bg-white text-gray-600 leading-relaxed border-t border-gray-100 animate-in slide-in-from-top-2">
                      {faq.jawab}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Links Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 hover:shadow-md transition cursor-pointer">
                <ShieldAlert className="w-8 h-8 text-orange-500 mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">Laporkan Penipuan</h3>
                <p className="text-sm text-gray-600">Lindungi komunitas dari UMKM fiktif.</p>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-5 hover:shadow-md transition cursor-pointer">
                <CreditCard className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="font-bold text-gray-900 mb-1">Masalah Pencairan</h3>
                <p className="text-sm text-gray-600">Hubungi bank / sistem Escrow kami.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Tiket Bantuan Kanan */}
        <div className="lg:w-1/3">
          <div className="bg-gray-900 rounded-3xl shadow-xl p-8 text-white sticky top-24">
            <h3 className="text-xl font-extrabold mb-2 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-blue-400" /> Butuh Bantuan Ekstra?
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Tim Customer Service "Cari Cuan" siap membantu kendala Anda 24/7. Kirimkan tiket laporan di bawah ini.
            </p>

            {ticketSent ? (
              <div className="bg-gray-800 rounded-2xl p-6 text-center animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-blue-900/50 rounded-full flex justify-center items-center mx-auto mb-4 border border-blue-500">
                  <CheckCircle className="w-8 h-8 text-blue-400" />
                </div>
                <h4 className="font-bold text-white mb-2">Tiket Berhasil Terkirim!</h4>
                <p className="text-gray-400 text-sm mb-4">Tim dukungan kami akan segera membalas laporan Anda melalui email yang terdaftar maksimal dalam 2 jam kerja.</p>
                <button 
                  onClick={() => setTicketSent(false)}
                  className="text-blue-400 text-sm font-bold hover:text-blue-300"
                >
                  Kirim Tiket Baru
                </button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setTicketSent(true); }}>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Subjek Masalah</label>
                  <select className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>Masalah Pembayaran</option>
                    <option>Sengketa Pekerjaan</option>
                    <option>Masalah Akun / Profil</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Deskripsi Detail</label>
                  <textarea 
                    rows="4" 
                    placeholder="Ceritakan detail kendala yang Anda alami..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition flex justify-center items-center">
                  <Send className="w-4 h-4 mr-2" /> Kirim Laporan
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Respons Rata-rata</p>
              <p className="font-black text-green-400 text-lg">⏳ 2 Jam Kerja</p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
