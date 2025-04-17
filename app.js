const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const sequelize = require('.config/database');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');
const messageRoutes = require('./routes/message');
const policeStationRoutes = require('./routes/policeStation');
const multer = require('multer');
const path = require('path');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File Upload Configuration
const storage = multer.diskStorage({
    estination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, '${Date.now()}=${file.originalname}');
    },
});
const upload = multer({ storage });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes(upload));
app.use('/api/messages', messageRoutes);
app.use('/api/police-stations', policeStationRoutes);

// Database Connection
sequelize.sync().then(() => {
    console.log('Database connected');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port${PORT}');
});