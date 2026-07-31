const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Setup static folder for uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware for JWT verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, role }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User created successfully', token, user: { id: user.id, email: user.email, name: user.name, role: user.role, kycStatus: user.kycStatus } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: 'Role mismatch' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, name: user.name, role: user.role, balance: user.balance, kycStatus: user.kycStatus } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Current User (Me)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role, balance: user.balance, kycStatus: user.kycStatus });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// KYC Upload
app.post('/api/users/kyc', authenticateToken, upload.single('ktp'), async (req, res) => {
  try {
    let ktpImageUrl = null;
    if (req.file) {
      ktpImageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        ktpImageUrl,
        kycStatus: 'VERIFIED' // For MVP, we auto-verify
      }
    });

    res.json({ message: 'KYC Verification successful', kycStatus: user.kycStatus, ktpImageUrl: user.ktpImageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- WALLET & TRANSACTIONS ---
app.get('/api/wallet', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ balance: user.balance, transactions });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/wallet/topup', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'umkm') return res.status(403).json({ error: 'Only UMKM can top up directly' });
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user.id },
        data: { balance: { increment: amount } }
      }),
      prisma.transaction.create({
        data: {
          userId: req.user.id,
          amount: amount,
          type: 'Masuk',
          description: 'Top up Saldo UMKM'
        }
      })
    ]);
    res.json({ success: true, message: 'Top up successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/wallet/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    
    if (user.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const fee = amount * 0.10;
    const amountSent = amount - fee;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: req.user.id },
        data: { balance: { decrement: amount } }
      }),
      prisma.transaction.create({
        data: {
          userId: req.user.id,
          amount: amountSent,
          type: 'Keluar',
          description: 'Penarikan ke Bank (Diterima)'
        }
      }),
      prisma.transaction.create({
        data: {
          userId: req.user.id,
          amount: fee,
          type: 'Keluar',
          description: 'Pajak & Biaya Platform (10%)'
        }
      })
    ]);
    res.json({ success: true, message: 'Withdrawal successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- JOBS ---

// Get all jobs (Lowongan)
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { umkm: { select: { name: true, id: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a job (Untuk UMKM)
app.post('/api/jobs', async (req, res) => {
  try {
    const { title, description, salary, location, type, umkmId, imageUrl } = req.body;
    
    // Check KYC & Balance
    const umkm = await prisma.user.findUnique({ where: { id: parseInt(umkmId) } });
    if (!umkm || umkm.kycStatus !== 'VERIFIED') {
      return res.status(403).json({ error: 'Akun belum terverifikasi KYC. Silakan verifikasi identitas terlebih dahulu.' });
    }
    
    // Calculate total cost based on job type
    const isSayembara = type === 'Sayembara' || type?.includes('Sayembara');
    const cost = parseInt(salary.replace(/\D/g, '')) || 0;
    const POSTING_FEE = 25000;
    const escrowAmount = isSayembara ? cost : 0;
    const totalDeduction = POSTING_FEE + escrowAmount;

    if (umkm.balance < totalDeduction) {
      return res.status(400).json({ error: `Saldo dompet Anda tidak cukup. Biaya: Rp ${totalDeduction.toLocaleString('id-ID')}` });
    }

    // Process Transaction and Job Creation
    const dbOperations = [
      prisma.job.create({
        data: { title, description, salary, location, type, umkmId, imageUrl }
      }),
      prisma.user.update({
        where: { id: parseInt(umkmId) },
        data: { balance: { decrement: totalDeduction } }
      }),
      prisma.transaction.create({
        data: {
          userId: parseInt(umkmId),
          amount: POSTING_FEE,
          type: 'Keluar',
          description: 'Biaya Publikasi Lowongan (Pajak Platform)'
        }
      })
    ];

    if (escrowAmount > 0) {
      dbOperations.push(
        prisma.transaction.create({
          data: {
            userId: parseInt(umkmId),
            amount: escrowAmount,
            type: 'Keluar',
            description: `Anggaran ditahan ke Escrow (Proyek: ${title})`
          }
        })
      );
    }

    const result = await prisma.$transaction(dbOperations);
    const job = result[0];
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get jobs posted by a specific UMKM
app.get('/api/jobs/umkm/:umkmId', async (req, res) => {
  try {
    const umkmId = parseInt(req.params.umkmId);
    const jobs = await prisma.job.findMany({
      where: { umkmId },
      include: { 
        applications: {
          include: {
            mahasiswa: {
              select: { id: true, name: true, email: true }
            }
          }
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit a job
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, salary, location, type } = req.body;
    const job = await prisma.job.update({
      where: { id },
      data: { title, description, salary, location, type }
    });
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a job
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    // Delete associated applications first to prevent foreign key errors
    await prisma.application.deleteMany({ where: { jobId: id } });
    await prisma.job.delete({ where: { id } });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- APPLICATIONS ---

// Create application (Mahasiswa melamar)
app.post('/api/applications', upload.single('file'), async (req, res) => {
  try {
    const jobId = parseInt(req.body.jobId);
    const mahasiswaId = parseInt(req.body.mahasiswaId);

    // Check KYC
    const mahasiswa = await prisma.user.findUnique({ where: { id: mahasiswaId } });
    if (!mahasiswa || mahasiswa.kycStatus !== 'VERIFIED') {
      return res.status(403).json({ error: 'Akun belum terverifikasi KYC. Silakan verifikasi identitas terlebih dahulu.' });
    }
    let submissionUrl = req.body.submissionUrl || null;
    const coverLetter = req.body.coverLetter || null;
    
    if (req.file) {
      submissionUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    }
    
    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: { jobId, mahasiswaId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already applied' });
    }

    const application = await prisma.application.create({
      data: { jobId, mahasiswaId, submissionUrl, coverLetter }
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get applications for a Mahasiswa
app.get('/api/applications/mahasiswa/:id', async (req, res) => {
  try {
    const mahasiswaId = parseInt(req.params.id);
    const applications = await prisma.application.findMany({
      where: { mahasiswaId },
      include: { job: { include: { umkm: { select: { name: true, id: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Approve an application (and reject others, close job)
app.put('/api/applications/:id/approve', authenticateToken, async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);

    // Get the application to find its jobId
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const jobId = application.jobId;
    const jobType = application.job.type;
    const umkmId = application.job.umkmId;

    if (req.user.id !== umkmId) {
       return res.status(403).json({ error: 'Only the job owner can approve this application' });
    }

    const transactions = [
      prisma.application.update({
        where: { id: applicationId },
        data: { status: 'APPROVED' }
      }),
      prisma.application.updateMany({
        where: { 
          jobId: jobId,
          id: { not: applicationId }
        },
        data: { status: 'REJECTED' }
      }),
      prisma.job.update({
        where: { id: jobId },
        data: { status: 'closed' }
      })
    ];

    // If Sayembara, process payment
    if (jobType === 'Sayembara') {
      const amount = parseFloat(req.body.amount) || parseFloat(application.job.salary?.replace(/\D/g,'')) || 0;
      
      // NOTE: We DO NOT decrement UMKM balance here because it was already deducted at posting time (Escrow).
      // We only increment Mahasiswa's balance to release the funds from Escrow.
      transactions.push(
        prisma.user.update({
          where: { id: application.mahasiswaId },
          data: { balance: { increment: amount } }
        }),
        prisma.transaction.create({
          data: {
            userId: umkmId,
            amount: 0,
            type: 'Info',
            description: `Dana Escrow diteruskan ke Mahasiswa: ${application.job.title}`
          }
        }),
        prisma.transaction.create({
          data: {
            userId: application.mahasiswaId,
            amount: amount,
            type: 'Masuk',
            description: `Karya Terpilih: ${application.job.title}`
          }
        })
      );
    }

    await prisma.$transaction(transactions);

    // Simpan ke in-memory store
    const notif = {
      id: Date.now(),
      userId: application.mahasiswaId,
      title: 'Lamaran Diterima! 🎉',
      message: `Selamat! Anda telah direkrut untuk proyek "${application.job.title}".`,
      time: new Date().toISOString(),
      type: 'success',
      link: '/status-lamaran'
    };
    globalNotifications.push(notif);

    // Kirim notifikasi via socket jika mahasiswa online
    if (usersSocketMap && usersSocketMap[application.mahasiswaId]) {
      const mSocketId = usersSocketMap[application.mahasiswaId];
      io.to(mSocketId).emit('receiveNotification', notif);
    }

    res.json({ success: true, message: 'Application approved successfully' });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update application status (UMKM terima/tolak)
app.put('/api/applications/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const application = await prisma.application.update({
      where: { id },
      data: { status }
    });
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- SOCKET.IO CHAT ---
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, text } = data;
      const msg = await prisma.message.create({
        data: { senderId: parseInt(senderId), receiverId: parseInt(receiverId), text }
      });
      // Emit to receiver
      io.to(receiverId.toString()).emit('receiveMessage', msg);
      // Also emit back to sender for multi-tab sync
      io.to(senderId.toString()).emit('messageSent', msg);
    } catch (e) {
      console.error('Error saving message:', e);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- USER LISTING (for starting new chats) ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, role: true, email: true }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST message via REST (fallback)
app.post('/api/messages', async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const msg = await prisma.message.create({
      data: { senderId: parseInt(senderId), receiverId: parseInt(receiverId), text }
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- CHAT API (REST) ---
app.get('/api/messages/contacts/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } }
      }
    });

    const contactsMap = new Map();
    for (const msg of messages) {
      const isSender = msg.senderId === userId;
      const contact = isSender ? msg.receiver : msg.sender;
      if (!contactsMap.has(contact.id)) {
        contactsMap.set(contact.id, {
          id: contact.id,
          name: contact.name,
          role: contact.role,
          avatar: contact.role === 'umkm' 
            ? "/freelance6.jpg"
            : "/freelance1.png",
          lastMessage: {
            text: msg.text,
            time: msg.createdAt,
            sender: isSender ? 'me' : 'other'
          }
        });
      }
    }
    res.json(Array.from(contactsMap.values()));
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, name: true, role: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/messages/history/:userId/:contactId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const contactId = parseInt(req.params.contactId);
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: contactId },
          { senderId: contactId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });
    const formatted = messages.map(msg => ({
      text: msg.text,
      time: msg.createdAt,
      sender: msg.senderId === userId ? 'me' : 'other'
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// In-memory notifications store (MVP)
const globalNotifications = [];

app.get('/api/notifications/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userNotifs = globalNotifications.filter(n => n.userId === userId);
  res.json(userNotifs);
});

const usersSocketMap = {};

io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    usersSocketMap[userId] = socket.id;
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      // Simpan ke database
      const msg = await prisma.message.create({
        data: {
          senderId: parseInt(data.senderId),
          receiverId: parseInt(data.receiverId),
          text: data.text
        }
      });
      
      // Kirim ke penerima jika sedang online
      const receiverSocketId = usersSocketMap[data.receiverId];

      const notif = {
        id: Date.now(),
        userId: data.receiverId,
        title: 'Pesan Baru 💬',
        message: data.text.length > 30 ? data.text.substring(0, 30) + '...' : data.text,
        time: new Date().toISOString(),
        type: 'info',
        link: '/chat'
      };
      globalNotifications.push(notif);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receiveMessage', msg);
        io.to(receiverSocketId).emit('receiveNotification', notif);
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, socketId] of Object.entries(usersSocketMap)) {
      if (socketId === socket.id) {
        delete usersSocketMap[userId];
        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
