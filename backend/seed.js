const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_JOBS = [
  { 
    judul: "Desain Logo & Kemasan Kedai Kopi", 
    harga: "Rp 150.000", 
    kategori: "Desain Grafis",
    tipeKerja: "Proyek Lepas",
    lokasi: "Tingkir, Salatiga (Remote)",
    deskripsi: "Kami membutuhkan desainer kreatif dari kampus untuk merombak logo kedai kopi kami agar terlihat lebih modern, kekinian, dan cocok untuk dicetak di kemasan gelas plastik es kopi susu kami."
  },
  { 
    judul: "Admin Sosial Media Instagram (1 Minggu)", 
    harga: "Rp 300.000", 
    kategori: "Digital Marketing",
    tipeKerja: "Part-Time",
    lokasi: "Sidorejo, Salatiga (Remote)",
    deskripsi: "Dicari mahasiswa yang paham algoritma Instagram untuk membalas DM pelanggan dan mengunggah konten (story/feed) secara rutin selama 1 minggu penuh menjelang masa promo diskon mahasiswa."
  }
];

async function main() {
  // Create a dummy UMKM user
  const umkm = await prisma.user.create({
    data: {
      email: 'umkm@demo.com',
      password: '123',
      name: 'UMKM Demo',
      role: 'umkm'
    }
  });

  // Create Jobs
  for (const job of DEFAULT_JOBS) {
    await prisma.job.create({
      data: {
        title: job.judul,
        description: job.deskripsi,
        salary: job.harga,
        location: job.lokasi,
        type: job.tipeKerja,
        umkmId: umkm.id
      }
    });
  }
  console.log('Seed completed!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
