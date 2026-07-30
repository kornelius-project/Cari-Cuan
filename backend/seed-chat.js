const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const umkm = await prisma.user.findFirst({ where: { role: 'umkm' } });
  
  // Find or create a mahasiswa
  let mahasiswa = await prisma.user.findFirst({ where: { role: 'mahasiswa' } });
  if (!mahasiswa) {
    mahasiswa = await prisma.user.create({
      data: {
        email: 'mahasiswa@demo.com',
        password: '123',
        name: 'Mahasiswa Demo',
        role: 'mahasiswa'
      }
    });
  }

  if (umkm && mahasiswa) {
    // Check if message exists
    const msg = await prisma.message.findFirst();
    if (!msg) {
      await prisma.message.create({
        data: {
          senderId: mahasiswa.id,
          receiverId: umkm.id,
          text: 'Halo Kak, saya tertarik melamar pekerjaan part-time ini. Berikut portofolio saya.'
        }
      });
      console.log('Seeded initial chat message');
    } else {
      console.log('Chat message already exists');
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
