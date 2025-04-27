const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:userId/:professorId', async (req, res) => {
    const { userId, professorId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: professorId },
                { sender: professorId, receiver: userId }
            ]
        }).sort('timestamp');
        res.json(messages);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
