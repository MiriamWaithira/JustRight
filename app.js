// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const sequelize = require('.config/database');
// const authRoutes = require('./routes/auth');
// const reportRoutes = require('./routes/report');
// const messageRoutes = require('./routes/message');
// const policeStationRoutes = require('./routes/PoliceStation');
// const adminRoutes = require('./routes/admin');const multer = require('multer');
// const path = require('path');

// dotenv.config();
// const app = express();

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static('public'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // File Upload Configuration
// const storage = multer.diskStorage({
//     estination: (req, file, cb) => {
//         cb(null, process.env.UPLOAD_DIR);
//     },
//     filename: (req, file, cb) => {
//         cb(null, '${Date.now()}=${file.originalname}');
//     },
// });
// const upload = multer({ storage });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/police-stations', policeStationRoutes);
// app.use('/api/admin', adminRoutes);

// // Database Connection
// sequelize.sync().then(() => {
//     console.log('Database connected');
// });

// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log('Server is running on port${PORT}');
// });




// ======================
//  Initial Configuration
// ======================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');
const app = express();

// ======================
//  Middleware Imports
// ======================
const { authenticateUser } = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorMiddleware');
const upload = require('./middleware/multerMiddleware');
const requestLogger = require('./middleware/requestLogger');

// ======================
//  Route Imports
// ======================
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');
const messageRoutes = require('./routes/message');
const policeStationRoutes = require('./routes/policeStation');
const adminRoutes = require('./routes/admin');

// ======================
//  Essential Middlewares
// ======================
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Custom middlewares
app.use(requestLogger);

// ======================
//  API Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/reports', authenticateUser(['public', 'moderator', 'admin']), reportRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/police-stations', policeStationRoutes);
app.use('/api/admin', authenticateUser(['admin']), adminRoutes);

// ======================
//  Error Handling
// ======================
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

app.use(errorHandler);

// ======================
//  Server Initialization
// ======================
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✔ Database connection established');

    if (process.env.NODE_ENV !== 'test') {
      await sequelize.sync({ alter: true });
      console.log('✔ Database synchronized');
      
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌿 Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    }
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;