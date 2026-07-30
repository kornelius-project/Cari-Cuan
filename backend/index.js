const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

    const user = await prisma.user.create({
      data: { email, password, name, role }
    });

    res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email, name: user.name, role: user.role } });
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
    
    // In production, compare hashed passwords. For demo, plain text is checked.
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(403).json({ error: 'Role mismatch' });
    }

    res.json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- JOBS ---

// Get all jobs (Lowongan)
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { umkm: { select: { name: true } } },
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
    const { title, description, salary, location, type, umkmId } = req.body;
    const job = await prisma.job.create({
      data: { title, description, salary, location, type, umkmId }
    });
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
app.post('/api/applications', async (req, res) => {
  try {
    const { jobId, mahasiswaId } = req.body;
    
    // Check if already applied
    const existing = await prisma.application.findFirst({
      where: { jobId, mahasiswaId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already applied' });
    }

    const application = await prisma.application.create({
      data: { jobId, mahasiswaId }
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
      include: { job: { include: { umkm: { select: { name: true } } } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json(applications);
  } catch (error) {
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
            ? "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=100&q=80"
            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
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

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
