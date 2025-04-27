const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
    try {
        const professors = await User.find({ role: 'professor' }).select('-password');
        res.json(professors);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
