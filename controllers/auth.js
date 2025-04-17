// controllers/auth.js
const bcrypt =require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PublicUser, Moderator, Admin } = require ('../models');

expoers.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if (role === 'public') {
        user = await PublicUser.create({ username, email, password: hashedPassword });
    } else if ( role === 'moderator') {
        user =await Moderator.create({ username, email, password: hashedPassword, licenseNumber: req.body.licenseNumber });
    } else if (role ==='admin') {
        user = await Admin.create({ username, email, password: hashedPassword});
    }
    res.status(201).json({ message: 'User registered successfully', user });
};

exports.login = async (req, res) => {
    const { email, password, role } = req.body;
    let user;
    if (role === 'public') {
        user = await PublicUser.findOne({ where: { email } });
    } else if (role === 'moderator') {
        user = await Moderator.findOne({ where: { email } });
    } else if (role === 'admin') {
        user = await Admin.findOne({ where: { email } });
    }
    if (!user || (!await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid Credentials' });
    }
    const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
};