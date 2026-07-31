import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardMahasiswa from './pages/DashboardMahasiswa';
import DashboardUMKM from './pages/DashboardUMKM';
import ProfilMahasiswa from './pages/ProfilMahasiswa';
import CariLowongan from './pages/CariLowongan';
import StatusLamaran from './pages/StatusLamaran';
import KycVerification from './pages/KycVerification';
import Leaderboard from './pages/Leaderboard';
import PusatBantuan from './pages/PusatBantuan';
import RiwayatTransaksi from './pages/RiwayatTransaksi';
import ProfilBisnis from './pages/ProfilBisnis';
import Chat from './pages/Chat';
import ScrollToTop from './components/ScrollToTop';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/lowongan" element={<CariLowongan />} />
        <Route path="/dashboard" element={<DashboardMahasiswa />} />
        <Route path="/dashboard-umkm" element={<DashboardUMKM />} />
        <Route path="/status-lamaran" element={<StatusLamaran />} />
        <Route path="/kyc" element={<KycVerification />} />
        <Route path="/profil" element={<ProfilMahasiswa />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/bantuan" element={<PusatBantuan />} />
        <Route path="/riwayat-transaksi" element={<RiwayatTransaksi />} />
        <Route path="/profil-bisnis" element={<ProfilBisnis />} />
        {/* Fallback route to redirect to home if URL is invalid */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;