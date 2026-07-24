import React, { useState } from 'react';
import { Briefcase, ChevronLeft, Store, GraduationCap } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'umkm' ? 'umkm' : 'mahasiswa';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(initialRole);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulasi API Call (Sengaja dibuat menerima password apapun untuk DEMO)
    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', role); // Menyimpan role pengguna
      
      if (!localStorage.getItem('userName')) {
        localStorage.setItem('userName', role === 'umkm' ? 'Toko Kopi Senja' : 'Andi (Mahasiswa)');
      }

      if (role === 'umkm') {
        window.location.href = '/dashboard-umkm';
      } else {
        window.location.href = '/lowongan';
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center mb-4 hover:opacity-80 transition cursor-pointer">
          <img src="/logo.png" alt="Logo Cari Cuan" className="h-32 w-auto object-contain mix-blend-multiply" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-2">
          Masuk ke Akun Anda
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-gray-100 rounded-3xl sm:px-10">
          
          {/* PEMILIHAN ROLE (TABS) */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole('mahasiswa')}
              className={`flex-1 flex justify-center items-center py-2.5 text-sm font-bold rounded-lg transition ${role === 'mahasiswa' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <GraduationCap className="w-4 h-4 mr-2" /> Mahasiswa
            </button>
            <button
              type="button"
              onClick={() => setRole('umkm')}
              className={`flex-1 flex justify-center items-center py-2.5 text-sm font-bold rounded-lg transition ${role === 'umkm' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Store className="w-4 h-4 mr-2" /> Pelaku UMKM
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={role === 'mahasiswa' ? "mahasiswa@kampus.ac.id" : "bisnis@gmail.com"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan kata sandi bebas untuk demo"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition ${role === 'mahasiswa' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <Link to="/register" className={`font-bold hover:underline ${role === 'mahasiswa' ? 'text-blue-600' : 'text-purple-600'}`}>
              Daftar di sini
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition font-medium">
            <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
