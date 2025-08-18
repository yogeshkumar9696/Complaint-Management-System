import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './src/lib/db.js';
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import complaintRoutes from './routes/complaint.js';
import adminRoutes from './routes/admin.js';
import staffRoutes from './routes/staff.js';
import path from 'path';

// 1. Load environment
dotenv.config();

// 2. Initialize app
const app = express();
app.use(cors({
 origin: [
    "http://localhost:5173",
    "https://complaint-management-system-alpha.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 3. Connect DB
connectDB();


// 4. Routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the College Complaint Portal API' });
});

// 5. Start server
const PORT = process.env.PORT || 3000;
const __dirname= path.resolve();

if(process.env.NODE_ENV==="production"){
  app.use(express.static(path.join(__dirname,"../frontend/dist")));

  app.get("*",(req, res) => {
    res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
  })
}

app.listen(PORT,() => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});