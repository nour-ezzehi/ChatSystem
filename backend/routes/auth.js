const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const jwtSecret = "9e7d4b58dcb42f16d24b07cb420c84479dfe457441338c59378f6508be52ab3ef4283376b9fc950386940634bb507aae7dcbcce19013c233f88975fd6f5d2b12ea70c1b145908715bc0126bd3c70c3621220f98bd4582288f8a284ff0b8c08f3bfb545efc28517980d75fbecdebfd9a85bfcdd6073a1c0b206a6b162afe50c8c9d27f4ebb969fc5cdb345a6a4e4e044e24469d75a6d6ebb15e28546f50e888584f7047c33b392d56e7420069055479ca0e80685be8bccb41727df1d4e19864f09cfcc116911ca0429e263e08de8ff1ba7650b1b141b9127c76565ce8e180bff0c3b9f9626a0b24ecb4944f91631a57c1f2614d157d28cf123388f4446faf4100"; // Replace with your env var

router.post('/register', async (req, res) => {
    const { name, email, password, role, courses, profilePic } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ name, email, password, role, courses, profilePic });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
