const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/professors', require('./routes/professors'));
app.use('/api/messages', require('./routes/messages'));

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
        const Message = require('./models/Message');
        const message = new Message({ sender: senderId, receiver: receiverId, content });
        console.log('Message:', message);

        await message.save();

        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
