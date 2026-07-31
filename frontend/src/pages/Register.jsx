import React, { useState } from 'react';
import { Briefcase, ChevronLeft, Store, GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('mahasiswa');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userName', data.user.name);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('token', data.token);

        // Redirect ke landing page
        window.location.href = '/';
      } else {
        alert(data.error || 'Gagal mendaftar');
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center mb-4 hover:opacity-80 transition cursor-pointer">
          <img src="/logo.png" alt="Logo Cari Cuan" className="h-32 w-auto object-contain mix-blend-multiply" />
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-2">
          Buat Akun Baru
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-gray-100 rounded-3xl sm:px-10">
          
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
              <Store className="w-4 h-4 mr-2" /> UMKM
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{role === 'mahasiswa' ? 'Nama Lengkap' : 'Nama Usaha/Toko'}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Aktif</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl" />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition ${role === 'mahasiswa' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} ${loading ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loading ? 'Memproses...' : 'Daftar Sekarang'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className={`font-bold hover:underline ${role === 'mahasiswa' ? 'text-blue-600' : 'text-purple-600'}`}>
              Masuk di sini
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