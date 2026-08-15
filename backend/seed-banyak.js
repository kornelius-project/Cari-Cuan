const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const ukmData = [
  { name: 'Simple Fashion', email: 'simplefashion@demo.com' }, // 0
  { name: 'Kedai Kopi Senja', email: 'senja@demo.com' }, // 1
  { name: 'PT Budi Sukses Perkasa', email: 'budisukses@demo.com' }, // 2
  { name: 'Global Advertising', email: 'globaladv@demo.com' }, // 3
  { name: 'Stay Corner', email: 'staycorner@demo.com' }, // 4
  { name: 'Ceritakita Photo Studio', email: 'ceritakita@demo.com' }, // 5
  { name: 'Infomedia', email: 'infomedia@demo.com' }, // 6
  { name: 'Mochi', email: 'mochi@demo.com' }, // 7
  { name: 'SFA Steak & Resto', email: 'sfasteak@demo.com' }, // 8
  { name: '95S Store', email: '95sstore@demo.com' }, // 9
  { name: 'Global Indo', email: 'globalindo@demo.com' }, // 10
  { name: 'Grebe', email: 'grebe@demo.com' }, // 11
];

const mahasiswaData = [
  { name: 'Budi Santoso', email: 'budi@demo.com', fakultas: 'Teknik', xp: 150, rating: 4.5 },
  { name: 'Siti Aminah', email: 'siti@demo.com', fakultas: 'Ekonomi', xp: 300, rating: 4.8 },
  { name: 'Andi Wijaya', email: 'andi@demo.com', fakultas: 'Ilmu Komputer', xp: 50, rating: 4.0 },
  { name: 'Rina Puspita', email: 'rina@demo.com', fakultas: 'Desain', xp: 500, rating: 4.9 },
  { name: 'Dimas Aditya', email: 'dimas@demo.com', fakultas: 'Sastra', xp: 120, rating: 4.2 },
];

const jobTemplates = [
  { title: 'Admin Shopee', type: 'Part-Time', category: 'Administrasi & Data', salary: 'Rp 1.500.000 / bulan', desc: 'Mencari admin Shopee untuk membalas chat dan memproses pesanan.', image: '/loker/admin shopee.jpg', umkmIndex: 0 },
  { title: 'Barista Full-time', type: 'Part-Time', category: 'Jasa Fisik & Lapangan', salary: 'Rp 3.500.000 / bulan', desc: 'Dibutuhkan barista berpengalaman untuk shift pagi.', image: '/loker/barista 1.jpg', umkmIndex: 1 },
  { title: 'Desain Grafis', type: 'Proyek Lepas', category: 'Desain Grafis', salary: 'Rp 350.000 / desain', desc: 'Butuh desainer untuk konten sosial media.', image: '/loker/desain grafis 2.jpg', umkmIndex: 2 },
  { title: 'Designer Grafis', type: 'Sayembara', category: 'Desain Grafis', salary: 'Rp 1.500.000', desc: 'Lowongan desainer grafis kreatif.', image: '/loker/design grafis 1.png', umkmIndex: 3 },
  { title: 'Drink Keeper', type: 'Part-Time', category: 'Jasa Fisik & Lapangan', salary: 'Rp 70.000 / shift', desc: 'Jaga stand minuman kekinian di area Solo.', image: '/loker/drink keeper 1.jpg', umkmIndex: 4 },
  { title: 'Fotografer Studio', type: 'Proyek Lepas', category: 'Jasa Fisik & Lapangan', salary: 'Rp 500.000 / sesi', desc: 'Butuh fotografer untuk studio dan wedding.', image: '/loker/fotografer.jpg', umkmIndex: 5 },
  { title: 'IT Staff', type: 'Part-Time', category: 'Teknologi', salary: 'Rp 2.500.000 / bulan', desc: 'Membantu pengelolaan IT dan jaringan perusahaan.', image: '/loker/it staff.jpg', umkmIndex: 6 },
  { title: 'Kasir Outlet', type: 'Part-Time', category: 'Administrasi & Data', salary: 'Rp 60.000 / hari', desc: 'Dibutuhkan kasir (crew outlet) part-time akhir pekan.', image: '/loker/kasir 1.jpg', umkmIndex: 7 },
  { title: 'Kitchen & Frontline', type: 'Part-Time', category: 'Jasa Fisik & Lapangan', salary: 'Rp 1.800.000 / bulan', desc: 'Membantu persiapan di dapur dan melayani pelanggan resto.', image: '/loker/kitchen dna frontline 1.jpg', umkmIndex: 8 },
  { title: 'Shop Keeper', type: 'Part-Time', category: 'Administrasi & Data', salary: 'Rp 75.000 / hari', desc: 'Jaga toko gadget dan aksesoris smartphone.', image: '/loker/shop keeper 1.jpg', umkmIndex: 9 },
  { title: 'Staff Accounting', type: 'Part-Time', category: 'Administrasi & Data', salary: 'Rp 2.200.000 / bulan', desc: 'Membantu pembukuan dan laporan keuangan bulanan.', image: '/loker/staff accounting.jpg', umkmIndex: 10 },
  { title: 'Talent & Content Creator', type: 'Proyek Lepas', category: 'Digital Marketing', salary: 'Rp 800.000 / proyek', desc: 'Mencari talent untuk video promosi dan TikTok Live.', image: '/loker/talent dan content creator.jpg', umkmIndex: 11 },
];

async function main() {
  console.log('Menyiapkan data yang banyak (seeding)...');

  // HAPUS DATA LAMA UNTUK MENGHINDARI DUPLIKASI
  console.log('Menghapus riwayat lamaran dan lowongan lama...');
  await prisma.application.deleteMany({});
  await prisma.job.deleteMany({});

  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Buat Data UMKM
  const createdUmkms = [];
  for (const u of ukmData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name }, // UPDATE NAME IF EXIST
      create: {
        email: u.email,
        password: passwordHash,
        name: u.name,
        role: 'umkm',
        kycStatus: 'VERIFIED'
      }
    });
    createdUmkms.push(user);
    console.log(`[+] UMKM: ${user.name}`);
  }

  // 2. Buat Data Mahasiswa
  const createdMahasiswas = [];
  for (const m of mahasiswaData) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        email: m.email,
        password: passwordHash,
        name: m.name,
        role: 'mahasiswa',
        fakultas: m.fakultas,
        xp: m.xp,
        rating: m.rating,
        kycStatus: 'VERIFIED',
        completedProjects: Math.floor(Math.random() * 5)
      }
    });
    createdMahasiswas.push(user);
    console.log(`[+] Mahasiswa: ${user.name}`);
  }

  // 3. Buat Jobs yang sesuai dengan gambar
  const createdJobs = [];
  for (let i = 0; i < jobTemplates.length; i++) {
    const template = jobTemplates[i];
    const umkm = createdUmkms[template.umkmIndex];
    
    const title = template.title;

    const job = await prisma.job.create({
      data: {
        title: title,
        description: template.desc,
        salary: template.salary,
        type: template.type,
        category: template.category,
        location: 'Salatiga (On-site / Remote)',
        status: i % 5 === 0 ? 'closed' : 'open', 
        umkmId: umkm.id,
        imageUrl: template.image // PAKAI GAMBAR DARI USER
      }
    });
    createdJobs.push(job);
  }
  console.log(`[+] Dibuat ${createdJobs.length} Lowongan Pekerjaan (Jobs) dengan gambar custom`);

  // 4. Buat Applications (Lamaran)
  let applicationCount = 0;
  for (let i = 0; i < 15; i++) {
    const job = createdJobs[Math.floor(Math.random() * createdJobs.length)];
    const mhs = createdMahasiswas[Math.floor(Math.random() * createdMahasiswas.length)];

    const existingApp = await prisma.application.findFirst({
      where: { jobId: job.id, mahasiswaId: mhs.id }
    });

    if (!existingApp) {
      const statuses = ['MENUNGGU', 'APPROVED', 'REJECTED'];
      await prisma.application.create({
        data: {
          jobId: job.id,
          mahasiswaId: mhs.id,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          coverLetter: 'Halo, saya sangat tertarik dan merasa cocok dengan pekerjaan ini.'
        }
      });
      applicationCount++;
    }
  }
  console.log(`[+] Dibuat ${applicationCount} Lamaran (Applications)`);

  console.log('--- SEEDING SELESAI ---');
  console.log('Semua password akun yang dibuat adalah: 123456');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
