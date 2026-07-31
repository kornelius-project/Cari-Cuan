import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

function KycVerification() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('ktp', file);

      const response = await fetch('http://localhost:5000/api/users/kyc', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        let user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          user = { 
            id: localStorage.getItem('userId'),
            name: localStorage.getItem('userName'),
            role: localStorage.getItem('userRole')
          };
        }
        user.kycStatus = 'VERIFIED';
        localStorage.setItem('user', JSON.stringify(user));
        
        setSuccess(true);
        setTimeout(() => {
          navigate(user.role === 'mahasiswa' ? '/dashboard-mahasiswa' : '/dashboard-umkm');
        }, 2000);
      } else {
        const err = await response.json();
        alert(err.error || 'Gagal mengunggah KYC');
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
              <Camera size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Identitas</h1>
            <p className="text-gray-500 text-sm">
              Unggah foto KTP Anda untuk memverifikasi akun dan mendapatkan akses penuh ke platform Cari-Cuan.
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifikasi Berhasil!</h2>
              <p className="text-gray-500">Akun Anda telah terverifikasi. Mengarahkan ke dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  id="ktp"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <label htmlFor="ktp" className="cursor-pointer flex flex-col items-center">
                  {preview ? (
                    <img src={preview} alt="Preview KTP" className="max-h-48 rounded-lg object-contain mb-4" />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                      <Upload size={32} />
                    </div>
                  )}
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    {preview ? 'Ganti Foto' : 'Pilih Foto KTP'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">Format: JPG, PNG (Max 5MB)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!file || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? 'Mengunggah...' : 'Verifikasi Sekarang'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default KycVerification;
